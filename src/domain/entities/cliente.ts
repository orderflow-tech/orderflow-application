import { BaseEntity } from './base-entity';
import { CPF, Email } from '../value-objects/value-objects';

export class Cliente extends BaseEntity {
  private nome: string;
  private cpf: CPF;
  private email?: Email;

  constructor(
    id: string,
    nome: string,
    cpf: string,
    email?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
    this.nome = nome;
    this.cpf = new CPF(cpf);
    this.email = email ? new Email(email) : undefined;
  }

  public getNome(): string {
    return this.nome;
  }

  public getCpf(): CPF {
    return this.cpf;
  }

  public getEmail(): Email | undefined {
    return this.email;
  }

  public updateNome(nome: string): void {
    this.nome = nome;
    this.updateTimestamp();
  }

  public updateEmail(email: string): void {
    this.email = new Email(email);
    this.updateTimestamp();
  }

  public toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      cpf: this.cpf.getValue(),
      email: this.email?.getValue(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

