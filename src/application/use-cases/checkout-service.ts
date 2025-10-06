import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { CheckoutUseCase } from '../ports/checkout-use-case';
import { CheckoutPedidoDTO, CheckoutResponseDTO } from '../dtos/pedido-dto';
import { IPedidoRepository } from '../../domain/interfaces/IPedidoRepository';
import { IProdutoRepository } from '../../domain/interfaces/IProdutoRepository';
import { IClienteRepository } from '../../domain/interfaces/IClienteRepository';
import { IPagamentoRepository } from '../../domain/interfaces/IPagamentoRepository';
import { PaymentGateway } from '../ports/payment-gateway';
import { Pedido } from '../../domain/entities/pedido';
import { ItemPedido } from '../../domain/entities/item-pedido';
import { Pagamento } from '../../domain/entities/pagamento';

@injectable()
export class CheckoutService implements CheckoutUseCase {
  constructor(
    @inject('PedidoRepository')
    private readonly pedidoRepository: IPedidoRepository,
    @inject('ProdutoRepository')
    private readonly produtoRepository: IProdutoRepository,
    @inject('ClienteRepository')
    private readonly clienteRepository: IClienteRepository,
    @inject('PagamentoRepository')
    private readonly pagamentoRepository: IPagamentoRepository,
    @inject('PaymentGateway')
    private readonly paymentGateway: PaymentGateway
  ) {}

  async execute(checkoutData: CheckoutPedidoDTO): Promise<CheckoutResponseDTO> {
    // Validar cliente se fornecido
    if (checkoutData.clienteId) {
      const cliente = await this.clienteRepository.findById(checkoutData.clienteId);
      if (!cliente) {
        throw new Error('Cliente não encontrado');
      }
    }

    // Validar produtos e criar itens do pedido
    const itens: ItemPedido[] = [];
    for (const itemDto of checkoutData.itens) {
      const produto = await this.produtoRepository.findById(itemDto.produtoId);
      if (!produto) {
        throw new Error(`Produto com ID ${itemDto.produtoId} não encontrado`);
      }
      if (!produto.isAtivo()) {
        throw new Error(`Produto ${produto.getNome()} não está disponível`);
      }

      const item = new ItemPedido(
        uuidv4(),
        produto.getId(),
        itemDto.quantidade,
        produto.getPreco().getValue(),
        itemDto.observacao
      );
      itens.push(item);
    }

    // Criar pedido
    const codigo = this.generateOrderCode();
    const pedido = new Pedido(
      uuidv4(),
      codigo,
      itens,
      checkoutData.clienteId
    );

    // Salvar pedido
    const pedidoSalvo = await this.pedidoRepository.save(pedido);

    // Criar pagamento
    const pagamento = new Pagamento(
      uuidv4(),
      pedidoSalvo.getId(),
      pedidoSalvo.getValorTotal().getValue(),
      checkoutData.tipoPagamento
    );

    // Integrar com gateway de pagamento
    const paymentResult = await this.paymentGateway.createPayment(
      pedidoSalvo.getId(),
      pedidoSalvo.getValorTotal().getValue(),
      checkoutData.tipoPagamento
    );

    // Atualizar pagamento com dados do gateway
    pagamento.updateExternalId(paymentResult.externalId);
    if (paymentResult.qrCodeUrl) {
      pagamento.updateQrCodeUrl(paymentResult.qrCodeUrl);
    }

    // Salvar pagamento
    const pagamentoSalvo = await this.pagamentoRepository.save(pagamento);

    // Montar resposta
    const pedidoResponse = await this.buildPedidoResponse(pedidoSalvo);
    
    return {
      pedido: pedidoResponse,
      pagamento: {
        id: pagamentoSalvo.getId(),
        status: pagamentoSalvo.getStatus(),
        tipo: pagamentoSalvo.getTipo(),
        qrCodeUrl: pagamentoSalvo.getQrCodeUrl(),
        valor: pagamentoSalvo.getValor().getValue()
      }
    };
  }

  private generateOrderCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private async buildPedidoResponse(pedido: Pedido) {
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
  }
}

