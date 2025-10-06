import { StatusPagamento } from '../../domain/value-objects/enums';

export interface ConsultarStatusPagamentoUseCase {
  execute(pedidoId: string): Promise<{
    pedidoId: string;
    status: StatusPagamento;
    qrCodeUrl?: string;
  }>;
}

