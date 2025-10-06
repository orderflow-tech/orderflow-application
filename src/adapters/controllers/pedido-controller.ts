import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { CheckoutUseCase } from '../../application/ports/checkout-use-case';
import { ConsultarStatusPagamentoUseCase } from '../../application/ports/consultar-status-pagamento-use-case';
import { WebhookPagamentoUseCase } from '../../application/ports/webhook-pagamento-use-case';
import { ListarPedidosUseCase } from '../../application/ports/listar-pedidos-use-case';
import { AtualizarStatusPedidoUseCase } from '../../application/ports/atualizar-status-pedido-use-case';
import { CheckoutPedidoDTO, UpdateStatusPedidoDTO } from '../../application/dtos/pedido-dto';
import { WebhookPagamentoDTO } from '../../application/dtos/pagamento-dto';

@injectable()
export class PedidoController {
  constructor(
    @inject('CheckoutUseCase')
    private readonly checkoutUseCase: CheckoutUseCase,
    @inject('ConsultarStatusPagamentoUseCase')
    private readonly consultarStatusPagamentoUseCase: ConsultarStatusPagamentoUseCase,
    @inject('WebhookPagamentoUseCase')
    private readonly webhookPagamentoUseCase: WebhookPagamentoUseCase,
    @inject('ListarPedidosUseCase')
    private readonly listarPedidosUseCase: ListarPedidosUseCase,
    @inject('AtualizarStatusPedidoUseCase')
    private readonly atualizarStatusPedidoUseCase: AtualizarStatusPedidoUseCase
  ) { }

  async checkout(req: Request, res: Response): Promise<void> {
    try {
      const checkoutData: CheckoutPedidoDTO = req.body;
      const result = await this.checkoutUseCase.execute(checkoutData);

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  async consultarStatusPagamento(req: Request, res: Response): Promise<void> {
    try {
      const { pedidoId } = req.params;
      if (pedidoId == undefined || pedidoId == '' || pedidoId == null)
        new Error('ID do pedido não informado')
      else {
        const result = await this.consultarStatusPagamentoUseCase.execute(pedidoId);
        res.status(200).json({
          success: true,
          data: result
        });
      }
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  async webhookPagamento(req: Request, res: Response): Promise<void> {
    try {
      const webhookData: WebhookPagamentoDTO = req.body;
      await this.webhookPagamentoUseCase.execute(webhookData);

      res.status(200).json({
        success: true,
        message: 'Webhook processado com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  async listarPedidos(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.listarPedidosUseCase.execute();

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }

  async atualizarStatusPedido(req: Request, res: Response): Promise<void> {
    try {
      const { pedidoId } = req.params;
      const updateData: UpdateStatusPedidoDTO = req.body;
      if (pedidoId == undefined || pedidoId == '' || pedidoId == null)
        new Error('ID do pedido não informado')
      else {

        const result = await this.atualizarStatusPedidoUseCase.execute(pedidoId, updateData);

        res.status(200).json({
          success: true,
          data: result
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor'
      });
    }
  }
}

