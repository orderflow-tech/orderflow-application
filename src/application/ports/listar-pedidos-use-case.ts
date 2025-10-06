import { PedidoResponseDTO } from '../dtos/pedido-dto';

export interface ListarPedidosUseCase {
  execute(): Promise<PedidoResponseDTO[]>;
}

