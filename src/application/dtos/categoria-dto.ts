export interface CreateCategoriaDTO {
  nome: string;
  descricao: string;
}

export interface UpdateCategoriaDTO {
  nome?: string;
  descricao?: string;
  ativo?: boolean;
}

export interface CategoriaResponseDTO {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

