import { BaseEntity } from './base-entity';
import { StatusPagamento, TipoPagamento } from '../value-objects/enums';
import { Money } from '../value-objects/value-objects';

export class Pagamento extends BaseEntity {
  private pedidoId: string;
  private valor: Money;
  private tipo: TipoPagamento;
  private status: StatusPagamento;
  private qrCodeUrl?: string;
  private transactionId?: string;
  private externalId?: string;

  constructor(
    id: string,
    pedidoId: string,
    valor: number,
    tipo: TipoPagamento,
    status: StatusPagamento = StatusPagamento.PENDENTE,
    qrCodeUrl?: string,
    transactionId?: string,
    externalId?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
    this.pedidoId = pedidoId;
    this.valor = new Money(valor);
    this.tipo = tipo;
    this.status = status;
    this.qrCodeUrl = qrCodeUrl;
    this.transactionId = transactionId;
    this.externalId = externalId;
  }

  public getPedidoId(): string {
    return this.pedidoId;
  }

  public getValor(): Money {
    return this.valor;
  }

  public getTipo(): TipoPagamento {
    return this.tipo;
  }

  public getStatus(): StatusPagamento {
    return this.status;
  }

  public getQrCodeUrl(): string | undefined {
    return this.qrCodeUrl;
  }

  public getTransactionId(): string | undefined {
    return this.transactionId;
  }

  public getExternalId(): string | undefined {
    return this.externalId;
  }

  public updateStatus(novoStatus: StatusPagamento): void {
    if (!this.isValidStatusTransition(this.status, novoStatus)) {
      throw new Error(`Transição de status inválida: ${this.status} -> ${novoStatus}`);
    }
    this.status = novoStatus;
    this.updateTimestamp();
  }

  public updateQrCodeUrl(qrCodeUrl: string): void {
    this.qrCodeUrl = qrCodeUrl;
    this.updateTimestamp();
  }

  public updateTransactionId(transactionId: string): void {
    this.transactionId = transactionId;
    this.updateTimestamp();
  }

  public updateExternalId(externalId: string): void {
    this.externalId = externalId;
    this.updateTimestamp();
  }

  public isApproved(): boolean {
    return this.status === StatusPagamento.APROVADO;
  }

  public isRejected(): boolean {
    return this.status === StatusPagamento.RECUSADO;
  }

  public isPending(): boolean {
    return this.status === StatusPagamento.PENDENTE;
  }

  private isValidStatusTransition(currentStatus: StatusPagamento, newStatus: StatusPagamento): boolean {
    const validTransitions: Record<StatusPagamento, StatusPagamento[]> = {
      [StatusPagamento.PENDENTE]: [StatusPagamento.APROVADO, StatusPagamento.RECUSADO],
      [StatusPagamento.APROVADO]: [],
      [StatusPagamento.RECUSADO]: []
    };

    return validTransitions[currentStatus].includes(newStatus);
  }

  public toJSON() {
    return {
      id: this.id,
      pedidoId: this.pedidoId,
      valor: this.valor.getValue(),
      tipo: this.tipo,
      status: this.status,
      qrCodeUrl: this.qrCodeUrl,
      transactionId: this.transactionId,
      externalId: this.externalId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

