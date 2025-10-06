export class CPF {
  private readonly value: string;

  constructor(cpf: string) {
    const cleanCpf = this.cleanCpf(cpf);
    if (!this.isValid(cleanCpf)) {
      throw new Error('CPF inválido');
    }
    this.value = cleanCpf;
  }

  public getValue(): string {
    return this.value;
  }

  public getFormattedValue(): string {
    return this.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  private cleanCpf(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  private isValid(cpf: string): boolean {
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;

    return true;
  }
}

export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error('Email inválido');
    }
    this.value = email.toLowerCase();
  }

  public getValue(): string {
    return this.value;
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export class Money {
  private readonly value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new Error('Valor monetário não pode ser negativo');
    }
    this.value = Math.round(value * 100) / 100; // Arredonda para 2 casas decimais
  }

  public getValue(): number {
    return this.value;
  }

  public add(other: Money): Money {
    return new Money(this.value + other.value);
  }

  public subtract(other: Money): Money {
    return new Money(this.value - other.value);
  }

  public multiply(factor: number): Money {
    return new Money(this.value * factor);
  }

  public isGreaterThan(other: Money): boolean {
    return this.value > other.value;
  }

  public isEqual(other: Money): boolean {
    return this.value === other.value;
  }
}

