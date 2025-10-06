import { CheckoutPedidoDTO, CheckoutResponseDTO } from '../dtos/pedido-dto';

export interface CheckoutUseCase {
  execute(checkoutData: CheckoutPedidoDTO): Promise<CheckoutResponseDTO>;
}

