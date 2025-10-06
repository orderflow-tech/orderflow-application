import { BaseEntity } from './base-entity';
import { Money } from '../value-objects/value-objects';

export class Produto extends BaseEntity {
  private nome: string;
  private descricao: string;
  private preco: Money;
  private categoriaId: string;
  private ativo: boolean;
  private imagemUrl?: string;

  constructor(
    id: string,
    nome: string,
    descricao: string,
    preco: number,
    categoriaId: string,
    ativo: boolean = true,
    imagemUrl?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
    this.nome = nome;
    this.descricao = descricao;
    this.preco = new Money(preco);
    this.categoriaId = categoriaId;
    this.ativo = ativo;
    this.imagemUrl = imagemUrl;
  }

  public getNome(): string {
    return this.nome;
  }

  public getDescricao(): string {
    return this.descricao;
  }

  public getPreco(): Money {
    return this.preco;
  }

  public getCategoriaId(): string {
    return this.categoriaId;
  }

  public isAtivo(): boolean {
    return this.ativo;
  }

  public getImagemUrl(): string | undefined {
    return this.imagemUrl;
  }

  public updateNome(nome: string): void {
    this.nome = nome;
    this.updateTimestamp();
  }

  public updateDescricao(descricao: string): void {
    this.descricao = descricao;
    this.updateTimestamp();
  }

  public updatePreco(preco: number): void {
    this.preco = new Money(preco);
    this.updateTimestamp();
  }

  public updateCategoria(categoriaId: string): void {
    this.categoriaId = categoriaId;
    this.updateTimestamp();
  }

  public updateImagemUrl(imagemUrl: string): void {
    this.imagemUrl = imagemUrl;
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
      preco: this.preco.getValue(),
      categoriaId: this.categoriaId,
      ativo: this.ativo,
      imagemUrl: this.imagemUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

