import { inject, injectable } from 'tsyringe';
import { ConsultarStatusPagamentoUseCase } from '../ports/consultar-status-pagamento-use-case';
import { IPagamentoRepository } from '../../domain/interfaces/IPagamentoRepository';
import { StatusPagamento } from '../../domain/value-objects/enums';

@injectable()
export class ConsultarStatusPagamentoService implements ConsultarStatusPagamentoUseCase {
  constructor(
    @inject('PagamentoRepository')
    private readonly pagamentoRepository: IPagamentoRepository
  ) { }

  async execute(pedidoId: string): Promise<{
    pedidoId: string;
    status: StatusPagamento;
    qrCodeUrl?: string
  }> {
    const pagamento = await this.pagamentoRepository.findByPedidoId(pedidoId);

    if (!pagamento) {
      throw new Error('Pagamento não encontrado para este pedido');
    }

    return {
      pedidoId,
      status: pagamento.getStatus(),
      qrCodeUrl: pagamento.getQrCodeUrl() ?? ''
    };
  }
}

