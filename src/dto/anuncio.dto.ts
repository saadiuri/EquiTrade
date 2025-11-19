export interface AnuncioDto {
  id: string;
  titulo: string;
  tipo: string;
  descricao?: string;
  preco: number;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
  vendedor: {
    id: string;
    nome: string;
    email: string;
  };
  cavalo: {
    id: string;
    nome: string;
    raca: string;
    idade: number;
  };
}

export interface CreateAnuncioDto {
  titulo: string;
  tipo: string;
  descricao?: string;
  preco: number;
  ativo?: boolean;
  vendedorId: string;
  cavaloId: string;
}

export interface UpdateAnuncioDto {
  titulo?: string;
  tipo?: string;
  descricao?: string;
  preco?: number;
  ativo?: boolean;
}

export interface FilterAnuncioDto {
  ativo?: boolean;
  tipo?: string;
  precoMin?: number;
  precoMax?: number;
  vendedorId?: string;
  cavaloId?: string;
}

