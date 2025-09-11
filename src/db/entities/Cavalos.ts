import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
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
  premios?: string; // String simples para versao incial, depois será entidade separado em uma relacao com outra entidade de premios

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relacionamento: um cavalo pertence a um usuário (dono/vendedor)
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  dono!: User;

  // Métodos simples para MVP
  marcarComoVendido(): void {
    this.disponivel = false;
  }

  reativarAnuncio(): void {
    this.disponivel = true;
  }
}
