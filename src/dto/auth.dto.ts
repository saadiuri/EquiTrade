export interface LoginDto {
  email: string;
  senha: string;
}

export interface RegisterDto {
  nome: string;
  email: string;
  senha: string;
  celular?: string;
  endereco?: string;
  tipo: 'Comprador' | 'Vendedor';
  nota?: number;
}

export interface AuthResponseDto {
  token: string;
  user: {
    id: string;
    nome: string;
    email: string;
    tipo: 'Comprador' | 'Vendedor';
  };
}

