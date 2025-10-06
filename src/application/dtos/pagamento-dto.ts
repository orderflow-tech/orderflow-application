import { StatusPagamento, TipoPagamento } from '../../domain/value-objects/enums';

export interface CreatePagamentoDTO {
  pedidoId: string;
  valor: number;
  tipo: TipoPagamento;
}

export interface UpdateStatusPagamentoDTO {
  status: StatusPagamento;
  transactionId?: string;
  externalId?: string;
}

export interface WebhookPagamentoDTO {
  externalId: string;
  status: StatusPagamento;
  transactionId?: string;
}

export interface PagamentoResponseDTO {
  id: string;
  pedidoId: string;
  valor: number;
  tipo: TipoPagamento;
  status: StatusPagamento;
  qrCodeUrl?: string;
  transactionId?: string;
  externalId?: string;
  createdAt: Date;
  updatedAt: Date;
}

