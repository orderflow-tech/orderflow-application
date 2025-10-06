export interface CreateProdutoDTO {
  nome: string;
  descricao: string;
  preco: number;
  categoriaId: string;
  imagemUrl?: string;
}

export interface UpdateProdutoDTO {
  nome?: string;
  descricao?: string;
  preco?: number;
  categoriaId?: string;
  imagemUrl?: string;
  ativo?: boolean;
}

export interface ProdutoResponseDTO {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoriaId: string;
  ativo: boolean;
  imagemUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

