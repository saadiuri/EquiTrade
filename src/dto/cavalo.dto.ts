// Base interface for Cavalo DTO
export interface CavaloDto {
  id: string;
  nome: string;
  idade: number;
  raca: string;
  preco: number;
  descricao?: string;
  disponivel: boolean;
  premios?: string;
  createdAt: Date;
  updatedAt: Date;
  dono: {
    id: string;
    nome: string;
    email: string;
  };
}

// Create DTO for new cavalos
export interface CreateCavaloDto {
  nome: string;
  idade: number;
  raca: string;
  preco: number;
  descricao?: string;
  disponivel?: boolean;
  premios?: string;
  donoId: string; // User ID who owns the horse
}

// Update DTO (all fields optional except id)
export interface UpdateCavaloDto {
  nome?: string;
  idade?: number;
  raca?: string;
  preco?: number;
  descricao?: string;
  disponivel?: boolean;
  premios?: string;
}

// DTO for filtering cavalos
export interface FilterCavaloDto {
  disponivel?: boolean;
  racaContains?: string;
  precoMin?: number;
  precoMax?: number;
  idadeMin?: number;
  idadeMax?: number;
  donoId?: string;
}
