import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import { User } from './User';

@Entity('cavalos')
export class Cavalo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  nome!: string;

  @Column({ type: 'int' })
  idade!: number;

  @Column({ type: 'varchar', length: 100 })
  raca!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco!: number;

  @Column({ type: 'text', nullable: true })
  descricao?: string;

  @Column({ type: 'boolean', default: true })
  disponivel!: boolean;

  @Column({ type: 'text', nullable: true })
  premios?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Dono do cavalo
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dono_id' })
  dono!: User;

  // Métodos de regra de negócio
  marcarComoVendido(): void {
    this.disponivel = false;
  }

  reativarAnuncio(): void {
    this.disponivel = true;
  }
}
