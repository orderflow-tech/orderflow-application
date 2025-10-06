import { inject, injectable } from 'tsyringe';
import { AtualizarStatusPedidoUseCase } from '../ports/atualizar-status-pedido-use-case';
import { UpdateStatusPedidoDTO, PedidoResponseDTO, PedidoPagamentoResponseDTO, PedidoPagamentoClienteResponseDTO } from '../dtos/pedido-dto';
import { IPedidoRepository } from '../../domain/interfaces/IPedidoRepository';
import { IClienteRepository } from '../../domain/interfaces/IClienteRepository';
import { IProdutoRepository } from '../../domain/interfaces/IProdutoRepository';
import { IPagamentoRepository } from '../../domain/interfaces/IPagamentoRepository';

@injectable()
export class AtualizarStatusPedidoService implements AtualizarStatusPedidoUseCase {
  constructor(
    @inject('PedidoRepository')
    private readonly pedidoRepository: IPedidoRepository,
    @inject('ClienteRepository')
    private readonly clienteRepository: IClienteRepository,
    @inject('ProdutoRepository')
    private readonly produtoRepository: IProdutoRepository,
    @inject('PagamentoRepository')
    private readonly pagamentoRepository: IPagamentoRepository
  ) {}

  async execute(pedidoId: string, updateData: UpdateStatusPedidoDTO): Promise<PedidoResponseDTO> {
    const pedido = await this.pedidoRepository.findById(pedidoId);
    
    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }

    // Atualizar status do pedido (a validação da transição é feita na entidade)
    pedido.updateStatus(updateData.status);
    
    // Salvar pedido atualizado
    const pedidoAtualizado = await this.pedidoRepository.update(pedido);

    // Montar resposta completa
    return await this.buildPedidoResponse(pedidoAtualizado);
  }

  private async buildPedidoResponse(pedido: any): Promise<PedidoResponseDTO> {
    // Buscar informações do cliente
    let cliente: PedidoPagamentoClienteResponseDTO = {} as PedidoPagamentoClienteResponseDTO;
    if (pedido.getClienteId()) {
      const clienteEntity = await this.clienteRepository.findById(pedido.getClienteId()!);
      if (clienteEntity) {
        cliente = {
          id: clienteEntity.getId(),
          nome: clienteEntity.getNome(),
          cpf: clienteEntity.getCpf().getValue()
        };
      }
    }

    // Buscar informações dos produtos
    const itens = await Promise.all(
      pedido.getItens().map(async (item: any) => {
        const produto = await this.produtoRepository.findById(item.getProdutoId());
        return {
          id: item.getId(),
          produtoId: item.getProdutoId(),
          produto: produto ? {
            id: produto.getId(),
            nome: produto.getNome(),
            descricao: produto.getDescricao(),
            preco: produto.getPreco().getValue(),
            categoriaId: produto.getCategoriaId()
          } : undefined,
          quantidade: item.getQuantidade(),
          valorUnitario: item.getValorUnitario().getValue(),
          valorTotal: item.getValorTotal().getValue(),
          observacao: item.getObservacao()
        };
      })
    );

    // Buscar informações do pagamento
    const pagamento = await this.pagamentoRepository.findByPedidoId(pedido.getId());
    let pagamentoInfo: PedidoPagamentoResponseDTO = {} as PedidoPagamentoResponseDTO;
    if (pagamento) {
      pagamentoInfo = {
        id: pagamento.getId(),
        status: pagamento.getStatus(),
        tipo: pagamento.getTipo(),
        qrCodeUrl: pagamento.getQrCodeUrl()
      } as PedidoPagamentoResponseDTO;
    }

    return {
      id: pedido.getId(),
      codigo: pedido.getCodigo(),
      clienteId: pedido.getClienteId(),
      cliente,
      status: pedido.getStatus(),
      itens,
      valorTotal: pedido.getValorTotal().getValue(),
      pagamento: pagamentoInfo,
      createdAt: pedido.getCreatedAt(),
      updatedAt: pedido.getUpdatedAt()
    };
  }
}

