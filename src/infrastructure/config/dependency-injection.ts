import { container } from 'tsyringe';

// Registrar repositórios (implementações serão criadas posteriormente)
container.register('ClienteRepository', { useClass: require('../adapters/repositories/postgres-cliente-repository').PostgresClienteRepository });
container.register('CategoriaRepository', { useClass: require('../adapters/repositories/postgres-categoria-repository').PostgresCategoriaRepository });
container.register('ProdutoRepository', { useClass: require('../adapters/repositories/postgres-produto-repository').PostgresProdutoRepository });
container.register('PedidoRepository', { useClass: require('../adapters/repositories/postgres-pedido-repository').PostgresPedidoRepository });
container.register('PagamentoRepository', { useClass: require('../adapters/repositories/postgres-pagamento-repository').PostgresPagamentoRepository });

// Registrar gateway de pagamento
// container.register('PaymentGateway', { useClass: require('./external-services/mock-payment-gateway').MockPaymentGateway });

// Registrar use cases
container.register('CheckoutUseCase', { useClass: require('../../application/use-cases/checkout-service').CheckoutService });
container.register('ConsultarStatusPagamentoUseCase', { useClass: require('../../application/use-cases/consultar-status-pagamento-service').ConsultarStatusPagamentoService });
container.register('WebhookPagamentoUseCase', { useClass: require('../../application/use-cases/webhook-pagamento-service').WebhookPagamentoService });
container.register('ListarPedidosUseCase', { useClass: require('../../application/use-cases/listar-pedidos-service').ListarPedidosService });
container.register('AtualizarStatusPedidoUseCase', { useClass: require('../../application/use-cases/atualizar-status-pedido-service').AtualizarStatusPedidoService });

