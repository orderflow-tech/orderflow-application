import { BaseEntity } from './base-entity';
import { StatusPedido } from '../value-objects/enums';
import { ItemPedido } from './item-pedido';
import { Money } from '../value-objects/value-objects';

export class Pedido extends BaseEntity {
  private codigo: string;
  private clienteId?: string;
  private status: StatusPedido;
  private itens: ItemPedido[];
  private valorTotal: Money;

  constructor(
    id: string,
    codigo: string,
    itens: ItemPedido[],
    clienteId?: string,
    status: StatusPedido = StatusPedido.RECEBIDO,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
    this.codigo = codigo;
    this.clienteId = clienteId;
    this.status = status;
    this.itens = itens;
    this.valorTotal = this.calculateValorTotal();

    if (itens.length === 0) {
      throw new Error('Pedido deve ter pelo menos um item');
    }
  }

  public getCodigo(): string {
    return this.codigo;
  }

  public getClienteId(): string | undefined {
    return this.clienteId;
  }

  public getStatus(): StatusPedido {
    return this.status;
  }

  public getItens(): ItemPedido[] {
    return [...this.itens]; // Retorna uma cópia para evitar mutação externa
  }

  public getValorTotal(): Money {
    return this.valorTotal;
  }

  public updateStatus(novoStatus: StatusPedido): void {
    if (!this.isValidStatusTransition(this.status, novoStatus)) {
      throw new Error(`Transição de status inválida: ${this.status} -> ${novoStatus}`);
    }
    this.status = novoStatus;
    this.updateTimestamp();
  }

  public addItem(item: ItemPedido): void {
    this.itens.push(item);
    this.valorTotal = this.calculateValorTotal();
    this.updateTimestamp();
  }

  public removeItem(itemId: string): void {
    this.itens = this.itens.filter(item => item.getId() !== itemId);
    this.valorTotal = this.calculateValorTotal();
    this.updateTimestamp();
  }

  public isFinalized(): boolean {
    return this.status === StatusPedido.FINALIZADO;
  }

  public canBeUpdated(): boolean {
    return this.status === StatusPedido.RECEBIDO;
  }

  private calculateValorTotal(): Money {
    return this.itens.reduce(
      (total, item) => total.add(item.getValorTotal()),
      new Money(0)
    );
  }

  private isValidStatusTransition(currentStatus: StatusPedido, newStatus: StatusPedido): boolean {
    const validTransitions: Record<StatusPedido, StatusPedido[]> = {
      [StatusPedido.RECEBIDO]: [StatusPedido.EM_PREPARACAO],
      [StatusPedido.EM_PREPARACAO]: [StatusPedido.PRONTO],
      [StatusPedido.PRONTO]: [StatusPedido.FINALIZADO],
      [StatusPedido.FINALIZADO]: []
    };

    return validTransitions[currentStatus].includes(newStatus);
  }

  public toJSON() {
    return {
      id: this.id,
      codigo: this.codigo,
      clienteId: this.clienteId,
      status: this.status,
      itens: this.itens.map(item => item.toJSON()),
      valorTotal: this.valorTotal.getValue(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

