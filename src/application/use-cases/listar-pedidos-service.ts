import { inject, injectable } from 'tsyringe';
import { ListarPedidosUseCase } from '../ports/listar-pedidos-use-case';
import { PedidoResponseDTO } from '../dtos/pedido-dto';
import { IPedidoRepository } from '../../domain/interfaces/IPedidoRepository';
import { IClienteRepository } from '../../domain/interfaces/IClienteRepository';
import { IProdutoRepository } from '../../domain/interfaces/IProdutoRepository';
import { IPagamentoRepository } from '../../domain/interfaces/IPagamentoRepository';
import { StatusPedido } from '../../domain/value-objects/enums';

@injectable()
export class ListarPedidosService implements ListarPedidosUseCase {
  constructor(
    @inject('PedidoRepository')
    private readonly pedidoRepository: IPedidoRepository,
    @inject('ClienteRepository')
    private readonly clienteRepository: IClienteRepository,
    @inject('ProdutoRepository')
    private readonly produtoRepository: IProdutoRepository,
    @inject('PagamentoRepository')
    private readonly pagamentoRepository: IPagamentoRepository
  ) { }

  async execute(): Promise<PedidoResponseDTO[]> {
    // Buscar pedidos ordenados para a cozinha (excluindo finalizados)
    const pedidos = await this.pedidoRepository.findAllOrderedForKitchen();

    // Montar resposta com informações completas
    const pedidosResponse = await Promise.all(
      pedidos.map(async (pedido) => {
        // Buscar informações do cliente
        let cliente;
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
          pedido.getItens().map(async (item) => {
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
        let pagamentoInfo;
        if (pagamento) {
          pagamentoInfo = {
            id: pagamento.getId(),
            status: pagamento.getStatus(),
            tipo: pagamento.getTipo(),
            qrCodeUrl: pagamento.getQrCodeUrl()
          };
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
      })
    );

    // Ordenar conforme regras de negócio:
    // 1. Pronto > Em Preparação > Recebido
    // 2. Mais antigos primeiro
    return pedidosResponse.sort((a, b) => {

      const statusOrder: Partial<Record<StatusPedido, number>> = {
        [StatusPedido.PRONTO]: 1,
        [StatusPedido.EM_PREPARACAO]: 2,
        [StatusPedido.RECEBIDO]: 3
      };

      const orderA = statusOrder[a.status] ?? 99;
      const orderB = statusOrder[b.status] ?? 99;

      const statusComparison = orderA - orderB;
      if (statusComparison !== 0) {
        return statusComparison;
      }

      // Se mesmo status, ordenar por data de criação (mais antigos primeiro)
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }
}

