import { StatusPedido, StatusPagamento, TipoPagamento } from '../../domain/value-objects/enums';

export interface CreateItemPedidoDTO {
  produtoId: string;
  quantidade: number;
  observacao?: string;
}

export interface CreatePedidoDTO {
  clienteId?: string;
  itens: CreateItemPedidoDTO[];
}

export interface CheckoutPedidoDTO {
  clienteId?: string;
  itens: CreateItemPedidoDTO[];
  tipoPagamento: TipoPagamento;
}

export interface UpdateStatusPedidoDTO {
  status: StatusPedido;
}

export interface ItemPedidoResponseDTO {
  id: string;
  produtoId: string;
  produto?: {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    categoriaId: string;
  };
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  observacao?: string;
}

export interface PedidoResponseDTO {
  id: string;
  codigo: string;
  clienteId?: string | undefined;
  cliente?: PedidoPagamentoClienteResponseDTO;
  status: StatusPedido;
  itens: ItemPedidoResponseDTO[];
  valorTotal: number;
  pagamento?: PedidoPagamentoResponseDTO | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckoutResponseDTO {
  pedido: PedidoResponseDTO;
  pagamento: {
    id: string;
    status: StatusPagamento;
    tipo: TipoPagamento;
    qrCodeUrl?: string;
    valor: number;
  };
}

export interface PedidoPagamentoResponseDTO {
  id: string;
  status: StatusPagamento;
  tipo: TipoPagamento;
  qrCodeUrl?: string;
}

export interface PedidoPagamentoClienteResponseDTO {
  id: string;
  nome: string;
  cpf: string;
}

