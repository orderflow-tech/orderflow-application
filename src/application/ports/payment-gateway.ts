import { TipoPagamento } from '../../domain/value-objects/enums';

export interface PaymentGateway {
  createPayment(pedidoId: string, valor: number, tipo: TipoPagamento): Promise<{
    qrCodeUrl?: string;
    externalId: string;
  }>;
  
  getPaymentStatus(externalId: string): Promise<{
    status: string;
    transactionId?: string;
  }>;
}

