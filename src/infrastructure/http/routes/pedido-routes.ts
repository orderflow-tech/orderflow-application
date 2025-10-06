import { Router } from 'express';
import { PedidoController } from '../../../adapters/controllers/pedido-controller';


export function pedidoRoutes(pedidoController: PedidoController) {
    const router = Router();
    /**
    * @swagger
    * /api/pedidos/checkout:
    *   post:
    *     summary: Realizar checkout de um pedido
    *     tags: [Pedidos]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             required:
    *               - itens
    *               - tipoPagamento
    *             properties:
    *               clienteId:
    *                 type: string
    *                 description: ID do cliente (opcional)
    *               itens:
    *                 type: array
    *                 items:
    *                   type: object
    *                   required:
    *                     - produtoId
    *                     - quantidade
    *                   properties:
    *                     produtoId:
    *                       type: string
    *                     quantidade:
    *                       type: integer
    *                       minimum: 1
    *                     observacao:
    *                       type: string
    *               tipoPagamento:
    *                 type: string
    *                 enum: [PIX, CARTAO_CREDITO, CARTAO_DEBITO, DINHEIRO]
    *     responses:
    *       201:
    *         description: Checkout realizado com sucesso
    *       400:
    *         description: Dados inválidos
    */
    router.post('/checkout', (req, res) => pedidoController.checkout(req, res));

    /**
     * @swagger
     * /api/pedidos/{pedidoId}/pagamento/status:
     *   get:
     *     summary: Consultar status de pagamento de um pedido
     *     tags: [Pedidos]
     *     parameters:
     *       - in: path
     *         name: pedidoId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do pedido
     *     responses:
     *       200:
     *         description: Status do pagamento consultado com sucesso
     *       404:
     *         description: Pedido não encontrado
     */
    router.get('/:pedidoId/pagamento/status', (req, res) => pedidoController.consultarStatusPagamento(req, res));

    /**
     * @swagger
     * /api/pedidos/webhook/pagamento:
     *   post:
     *     summary: Webhook para confirmação de pagamento
     *     tags: [Pedidos]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - externalId
     *               - status
     *             properties:
     *               externalId:
     *                 type: string
     *                 description: ID externo do pagamento
     *               status:
     *                 type: string
     *                 enum: [PENDENTE, APROVADO, RECUSADO]
     *               transactionId:
     *                 type: string
     *                 description: ID da transação (opcional)
     *     responses:
     *       200:
     *         description: Webhook processado com sucesso
     *       400:
     *         description: Dados inválidos
     */
    router.post('/webhook/pagamento', (req, res) => pedidoController.webhookPagamento(req, res));

    /**
     * @swagger
     * /api/pedidos:
     *   get:
     *     summary: Listar pedidos ordenados para a cozinha
     *     tags: [Pedidos]
     *     description: Lista pedidos excluindo os finalizados, ordenados por status (Pronto > Em Preparação > Recebido) e data de criação
     *     responses:
     *       200:
     *         description: Lista de pedidos retornada com sucesso
     *       500:
     *         description: Erro interno do servidor
     */
    router.get('/', (req, res) => pedidoController.listarPedidos(req, res));

    /**
     * @swagger
     * /api/pedidos/{pedidoId}/status:
     *   put:
     *     summary: Atualizar status de um pedido
     *     tags: [Pedidos]
     *     parameters:
     *       - in: path
     *         name: pedidoId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do pedido
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - status
     *             properties:
     *               status:
     *                 type: string
     *                 enum: [RECEBIDO, EM_PREPARACAO, PRONTO, FINALIZADO]
     *     responses:
     *       200:
     *         description: Status do pedido atualizado com sucesso
     *       400:
     *         description: Transição de status inválida
     *       404:
     *         description: Pedido não encontrado
     */
    router.put('/:pedidoId/status', (req, res) => pedidoController.atualizarStatusPedido(req, res));

    return router;
}
