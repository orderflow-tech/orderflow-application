import { UpdateStatusPedidoDTO, PedidoResponseDTO } from '../dtos/pedido-dto';

export interface AtualizarStatusPedidoUseCase {
  execute(pedidoId: string, updateData: UpdateStatusPedidoDTO): Promise<PedidoResponseDTO>;
}

