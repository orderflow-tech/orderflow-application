import { BaseEntity } from './base-entity';
import { Money } from '../value-objects/value-objects';

export class ItemPedido extends BaseEntity {
  private produtoId: string;
  private quantidade: number;
  private valorUnitario: Money;
  private observacao?: string;

  constructor(
    id: string,
    produtoId: string,
    quantidade: number,
    valorUnitario: number,
    observacao?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
    this.produtoId = produtoId;
    this.quantidade = quantidade;
    this.valorUnitario = new Money(valorUnitario);
    this.observacao = observacao;

    if (quantidade <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }
  }

  public getProdutoId(): string {
    return this.produtoId;
  }

  public getQuantidade(): number {
    return this.quantidade;
  }

  public getValorUnitario(): Money {
    return this.valorUnitario;
  }

  public getObservacao(): string | undefined {
    return this.observacao;
  }

  public getValorTotal(): Money {
    return this.valorUnitario.multiply(this.quantidade);
  }

  public updateQuantidade(quantidade: number): void {
    if (quantidade <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }
    this.quantidade = quantidade;
    this.updateTimestamp();
  }

  public updateObservacao(observacao: string): void {
    this.observacao = observacao;
    this.updateTimestamp();
  }

  public toJSON() {
    return {
      id: this.id,
      produtoId: this.produtoId,
      quantidade: this.quantidade,
      valorUnitario: this.valorUnitario.getValue(),
      valorTotal: this.getValorTotal().getValue(),
      observacao: this.observacao,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

