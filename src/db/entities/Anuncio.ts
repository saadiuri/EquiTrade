import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, } from 'typeorm';
import { User } from './User';
import { Cavalo } from './Cavalos';

@Entity('anuncios')
export abstract class Anuncio {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  titulo!: string;

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
  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendedorId' })
  vendedor!: User;

  // Relacionamento: um anúncio está vinculado a um cavalo
  @ManyToOne(() => Cavalo, cavalo => cavalo.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cavaloId' })
  cavalo!: Cavalo;

  // Métodos abstratos para implementação nas classes filhas
  abstract marcarComoVendido(): Promise<void>;
  abstract reativarAnuncio(): Promise<void>;
}
