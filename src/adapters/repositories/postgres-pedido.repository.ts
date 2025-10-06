import { IPedidoRepository } from '../../domain/interfaces/IPedidoRepository';
import { Pedido } from '../../domain/entities/pedido';
import { ItemPedido } from '../../domain/entities/item-pedido';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { injectable } from 'tsyringe';
import { AppDataSource } from '../../infrastructure/database/postgres/data-source';

@injectable()
export class PostgresPedidoRepository implements IPedidoRepository {
  private ormRepository: Repository<Pedido>;
  private ormItemRepository: Repository<ItemPedido>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(PedidoEntity);
    this.ormItemRepository = AppDataSource.getRepository(ItemPedidoEntity);
  }

  async findById(id: string): Promise<Pedido | null> {
    const pedidoEntity = await this.ormRepository.findOne({ 
      where: { id },
      relations: ['cliente', 'itens', 'itens.produto']
    });
    return pedidoEntity ? this.mapToDomain(pedidoEntity) : null;
  }

  async findByCodigo(codigo: string): Promise<Pedido | null> {
    const pedidoEntity = await this.ormRepository.findOne({ 
      where: { codigo },
      relations: ['cliente', 'itens', 'itens.produto']
    });
    return pedidoEntity ? this.mapToDomain(pedidoEntity) : null;
  }

  async findByClienteId(clienteId: string): Promise<Pedido[]> {
    const pedidosEntity = await this.ormRepository.find({ 
      where: { clienteId },
      relations: ['cliente', 'itens', 'itens.produto'],
      order: { dataCriacao: 'DESC' }
    });
    return pedidosEntity.map(pedido => this.mapToDomain(pedido));
  }

  async save(pedido: Pedido): Promise<Pedido> {
    // Se não tiver ID, gera um novo
    if (!pedido.id) {
      pedido.id = uuidv4();
    }

    // Salvar o pedido primeiro
    const pedidoEntity = this.mapToEntity(pedido);
    const itens = pedidoEntity.itens;
    pedidoEntity.itens = [];
    
    await this.ormRepository.save(pedidoEntity);

    // Salvar os itens do pedido
    if (itens && itens.length > 0) {
      for (const item of itens) {
        item.pedidoId = pedidoEntity.id;
        if (!item.id) {
          item.id = uuidv4();
        }
      }
      await this.ormItemRepository.save(itens);
    }

    // Buscar o pedido completo
    return this.findById(pedidoEntity.id) as Promise<Pedido>;
  }

  async update(id: string, pedidoData: Partial<Pedido>): Promise<Pedido | null> {
    const pedidoExistente = await this.ormRepository.findOne({ 
      where: { id },
      relations: ['itens']
    });
    
    if (!pedidoExistente) {
      return null;
    }

    // Atualizar os campos do pedido
    if (pedidoData.clienteId !== undefined) pedidoExistente.clienteId = pedidoData.clienteId;
    if (pedidoData.status !== undefined) pedidoExistente.status = pedidoData.status;
    if (pedidoData.valorTotal !== undefined) pedidoExistente.valorTotal = pedidoData.valorTotal;
    if (pedidoData.tempoEspera !== undefined) pedidoExistente.tempoEspera = pedidoData.tempoEspera;
    if (pedidoData.observacao !== undefined) pedidoExistente.observacao = pedidoData.observacao;
    
    pedidoExistente.dataAtualizacao = new Date();
    
    // Se o status for FINALIZADO, registrar a data de finalização
    if (pedidoData.status === StatusPedido.FINALIZADO) {
      pedidoExistente.dataFinalizacao = new Date();
    }

    // Atualizar os itens do pedido se fornecidos
    if (pedidoData.itens) {
      // Remover itens existentes
      if (pedidoExistente.itens && pedidoExistente.itens.length > 0) {
        await this.ormItemRepository.remove(pedidoExistente.itens);
      }

      // Adicionar novos itens
      const novosItens: ItemPedidoEntity[] = [];
      for (const item of pedidoData.itens) {
        const itemEntity = new ItemPedidoEntity();
        itemEntity.id = item.id || uuidv4();
        itemEntity.pedidoId = id;
        itemEntity.produtoId = item.produtoId;
        itemEntity.quantidade = item.quantidade;
        itemEntity.valorUnitario = item.valorUnitario;
        itemEntity.observacao = item.observacao;
        novosItens.push(itemEntity);
      }

      await this.ormItemRepository.save(novosItens);
    }

    await this.ormRepository.save(pedidoExistente);
    
    // Buscar o pedido atualizado
    return this.findById(id);
  }

  async updateStatus(id: string, status: StatusPedido): Promise<Pedido | null> {
    const pedidoExistente = await this.ormRepository.findOne({ where: { id } });
    
    if (!pedidoExistente) {
      return null;
    }

    pedidoExistente.status = status;
    pedidoExistente.dataAtualizacao = new Date();
    
    // Se o status for FINALIZADO, registrar a data de finalização
    if (status === StatusPedido.FINALIZADO) {
      pedidoExistente.dataFinalizacao = new Date();
    }

    await this.ormRepository.save(pedidoExistente);
    
    // Buscar o pedido atualizado
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    // Primeiro remover os itens relacionados
    const pedido = await this.ormRepository.findOne({ 
      where: { id },
      relations: ['itens']
    });
    
    if (!pedido) {
      return false;
    }

    if (pedido.itens && pedido.itens.length > 0) {
      await this.ormItemRepository.remove(pedido.itens);
    }

    // Depois remover o pedido
    const result = await this.ormRepository.delete(id);
    return !!result.affected && result.affected > 0;
  }

  async findAll(): Promise<Pedido[]> {
    const pedidosEntity = await this.ormRepository.find({ 
      relations: ['cliente', 'itens', 'itens.produto'],
      order: { dataCriacao: 'DESC' }
    });
    return pedidosEntity.map(pedido => this.mapToDomain(pedido));
  }

  async findByStatus(status: StatusPedido): Promise<Pedido[]> {
    const pedidosEntity = await this.ormRepository.find({ 
      where: { status },
      relations: ['cliente', 'itens', 'itens.produto'],
      order: { dataCriacao: 'ASC' }
    });
    return pedidosEntity.map(pedido => this.mapToDomain(pedido));
  }

  private mapToDomain(entity: PedidoEntity): Pedido {
    return {
      id: entity.id,
      clienteId: entity.clienteId,
      cliente: entity.cliente ? {
        id: entity.cliente.id,
        cpf: entity.cliente.cpf,
        nome: entity.cliente.nome,
        email: entity.cliente.email,
        dataCadastro: entity.cliente.dataCadastro
      } : undefined,
      codigo: entity.codigo,
      status: entity.status,
      valorTotal: entity.valorTotal,
      itens: entity.itens ? entity.itens.map(item => ({
        id: item.id,
        pedidoId: item.pedidoId,
        produtoId: item.produtoId,
        produto: item.produto ? {
          id: item.produto.id,
          nome: item.produto.nome,
          descricao: item.produto.descricao ?? '',
          preco: item.produto.preco,
          categoriaId: item.produto.categoriaId,
          ativo: item.produto.ativo
        } : undefined,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        observacao: item.observacao
      })) : [],
      tempoEspera: entity.tempoEspera,
      observacao: entity.observacao,
      dataCriacao: entity.dataCriacao,
      dataAtualizacao: entity.dataAtualizacao,
      dataFinalizacao: entity.dataFinalizacao
    };
  }

  private mapToEntity(domain: Pedido): PedidoEntity {
    const entity = new PedidoEntity();
    entity.id = domain.id;
    entity.clienteId = domain.clienteId;
    entity.codigo = domain.codigo;
    entity.status = domain.status;
    entity.valorTotal = domain.valorTotal;
    entity.tempoEspera = domain.tempoEspera || 0;
    entity.observacao = domain.observacao;
    entity.dataCriacao = domain.dataCriacao || new Date();
    entity.dataAtualizacao = domain.dataAtualizacao || new Date();
    entity.dataFinalizacao = domain.dataFinalizacao;
    
    if (domain.itens) {
      entity.itens = domain.itens.map(item => {
        const itemEntity = new ItemPedidoEntity();
        itemEntity.id = item.id || uuidv4();
        itemEntity.pedidoId = domain.id;
        itemEntity.produtoId = item.produtoId;
        itemEntity.quantidade = item.quantidade;
        itemEntity.valorUnitario = item.valorUnitario;
        itemEntity.observacao = item.observacao;
        return itemEntity;
      });
    }
    
    return entity;
  }
}
