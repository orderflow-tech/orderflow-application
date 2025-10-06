import { BaseEntity } from './base-entity';

export class Categoria extends BaseEntity {
  private nome: string;
  private descricao: string;
  private ativo: boolean;

  constructor(
    id: string,
    nome: string,
    descricao: string,
    ativo: boolean = true,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
    this.nome = nome;
    this.descricao = descricao;
    this.ativo = ativo;
  }

  public getNome(): string {
    return this.nome;
  }

  public getDescricao(): string {
    return this.descricao;
  }

  public isAtivo(): boolean {
    return this.ativo;
  }

  public updateNome(nome: string): void {
    this.nome = nome;
    this.updateTimestamp();
  }

  public updateDescricao(descricao: string): void {
    this.descricao = descricao;
    this.updateTimestamp();
  }

  public ativar(): void {
    this.ativo = true;
    this.updateTimestamp();
  }

  public desativar(): void {
    this.ativo = false;
    this.updateTimestamp();
  }

  public toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      descricao: this.descricao,
      ativo: this.ativo,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

