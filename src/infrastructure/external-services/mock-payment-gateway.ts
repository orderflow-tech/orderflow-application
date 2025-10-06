import { injectable } from 'tsyringe';
import { PaymentGateway } from '../../application/ports/payment-gateway';
import { TipoPagamento } from '../../domain/value-objects/enums';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class MockPaymentGateway implements PaymentGateway {
  async createPayment(pedidoId: string, valor: number, tipo: TipoPagamento): Promise<{
    qrCodeUrl?: string;
    externalId: string;
  }> {
    const externalId = uuidv4();
    
    // Simular criação de QR Code para PIX
    let qrCodeUrl;
    if (tipo === TipoPagamento.PIX) {
      qrCodeUrl = `https://mock-payment-gateway.com/qr/${externalId}`;
    }

    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      qrCodeUrl,
      externalId
    };
  }

  async getPaymentStatus(externalId: string): Promise<{
    status: string;
    transactionId?: string;
  }> {
    // Simular consulta de status
    await new Promise(resolve => setTimeout(resolve, 50));

    // Simular status aleatório para demonstração
    const statuses = ['PENDENTE', 'APROVADO', 'RECUSADO'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      status: randomStatus,
      transactionId: randomStatus === 'APROVADO' ? uuidv4() : undefined
    };
  }
}

