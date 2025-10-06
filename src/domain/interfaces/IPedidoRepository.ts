import { Pedido } from '../entities/pedido';
import { StatusPedido } from '../value-objects/enums';

export interface IPedidoRepository {
  save(pedido: Pedido): Promise<Pedido>;
  findById(id: string): Promise<Pedido | null>;
  findByCodigo(codigo: string): Promise<Pedido | null>;
  findByClienteId(clienteId: string): Promise<Pedido[]>;
  findByStatus(status: StatusPedido): Promise<Pedido[]>;
  findAll(): Promise<Pedido[]>;
  findAllExceptFinalized(): Promise<Pedido[]>;
  findAllOrderedForKitchen(): Promise<Pedido[]>;
  update(pedido: Pedido): Promise<Pedido>;
  updateStatus(id: string, status: StatusPedido): Promise<Pedido | null>;
  delete(id: string): Promise<void>;
}

