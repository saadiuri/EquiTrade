export const USER_TYPE = {
  COMPRADOR: 'Comprador',
  VENDEDOR: 'Vendedor',
} as const;

// Base interfaces for common fields
interface BaseUserDto {
  id: string;
  nome: string;
  email: string;
  celular?: string;
  endereco?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Discriminated union for specific user types
export interface CompradorDto extends BaseUserDto {
  type: typeof USER_TYPE.COMPRADOR;
}

export interface VendedorDto extends BaseUserDto {
  type: typeof USER_TYPE.VENDEDOR;
  nota: number;
}

// Union type for polymorphic handling
export type UserDto = CompradorDto | VendedorDto;

// Create DTOs with discriminators
export interface CreateCompradorDto {
  nome: string;
  email: string;
  senha: string;
  celular?: string;
  endereco?: string;
}

export interface CreateVendedorDto {
  nome: string;
  email: string;
  senha: string;
  celular?: string;
  endereco?: string;
  nota?: number;
}

export type CreateUserDto = 
  | { type: typeof USER_TYPE.COMPRADOR; data: CreateCompradorDto }
  | { type: typeof USER_TYPE.VENDEDOR; data: CreateVendedorDto };

// Update DTOs (optional fields)
export interface UpdateCompradorDto {
  nome?: string;
  email?: string;
  senha?: string;
  celular?: string;
  endereco?: string;
}

export interface UpdateVendedorDto {
  nome?: string;
  email?: string;
  senha?: string;
  celular?: string;
  endereco?: string;
  nota?: number;
}

export type UpdateUserDto = 
  | { type: typeof USER_TYPE.COMPRADOR; data: UpdateCompradorDto }
  | { type: typeof USER_TYPE.VENDEDOR; data: UpdateVendedorDto };

// Type guards for runtime type checking
export function isCompradorDto(user: UserDto): user is CompradorDto {
  return user.type === USER_TYPE.COMPRADOR;
}

export function isVendedorDto(user: UserDto): user is VendedorDto {
  return user.type === USER_TYPE.VENDEDOR;
}
