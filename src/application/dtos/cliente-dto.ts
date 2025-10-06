export interface CreateClienteDTO {
  nome: string;
  cpf: string;
  email?: string;
}

export interface UpdateClienteDTO {
  nome?: string;
  email?: string;
}

export interface ClienteResponseDTO {
  id: string;
  nome: string;
  cpf: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

