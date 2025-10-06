import { inject, injectable } from 'tsyringe';
import { WebhookPagamentoUseCase } from '../ports/webhook-pagamento-use-case';
import { WebhookPagamentoDTO } from '../dtos/pagamento-dto';
import { IPagamentoRepository } from '../../domain/interfaces/IPagamentoRepository';
import { IPedidoRepository } from '../../domain/interfaces/IPedidoRepository';
import { StatusPagamento, StatusPedido } from '../../domain/value-objects/enums';

@injectable()
export class WebhookPagamentoService implements WebhookPagamentoUseCase {
  constructor(
    @inject('PagamentoRepository')
    private readonly pagamentoRepository: IPagamentoRepository,
    @inject('PedidoRepository')
    private readonly pedidoRepository: IPedidoRepository
  ) {}

  async execute(webhookData: WebhookPagamentoDTO): Promise<void> {
    // Buscar pagamento pelo ID externo
    const pagamento = await this.pagamentoRepository.findByExternalId(webhookData.externalId);
    
    if (!pagamento) {
      throw new Error(`Pagamento não encontrado para externalId: ${webhookData.externalId}`);
    }

    // Atualizar status do pagamento
    pagamento.updateStatus(webhookData.status);
    
    if (webhookData.transactionId) {
      pagamento.updateTransactionId(webhookData.transactionId);
    }

    await this.pagamentoRepository.update(pagamento);

    // Se pagamento foi aprovado, atualizar status do pedido para EM_PREPARACAO
    if (webhookData.status === StatusPagamento.APROVADO) {
      const pedido = await this.pedidoRepository.findById(pagamento.getPedidoId());
      
      if (pedido && pedido.getStatus() === StatusPedido.RECEBIDO) {
        pedido.updateStatus(StatusPedido.EM_PREPARACAO);
        await this.pedidoRepository.update(pedido);
      }
    }
  }
}

