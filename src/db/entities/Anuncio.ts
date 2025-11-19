import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Cavalo } from './Cavalos';

@Entity('anuncios')
export class Anuncio {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  titulo!: string;

  @Column({ type: "varchar" })
  tipo!: string;

  @Column({ type: 'text', nullable: true })
  descricao?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco!: number;

  @Column({ type: 'boolean', default: true })
  ativo!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relacionamento: um anúncio pertence a um usuário (vendedor)
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendedorId' })
  vendedor!: User;

  // Relacionamento: um anúncio está vinculado a um cavalo
  @ManyToOne(() => Cavalo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cavaloId' })
  cavalo!: Cavalo;

  // Métodos simples para MVP
  marcarComoVendido(): void {
    this.ativo = false;
  }

  reativarAnuncio(): void {
    this.ativo = true;
  }
}
