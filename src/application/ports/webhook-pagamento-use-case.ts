import { WebhookPagamentoDTO } from '../dtos/pagamento-dto';

export interface WebhookPagamentoUseCase {
  execute(webhookData: WebhookPagamentoDTO): Promise<void>;
}

