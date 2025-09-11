import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, TableInheritance } from 'typeorm';
import { User } from './User';

@Entity('cavalos')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Cavalo {
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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relacionamento: um cavalo pertence a um usuário (dono/vendedor)
  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  dono!: User;

  // Métodos abstratos para implementação nas classes filhas
  abstract marcarComoVendido(): Promise<void>;
  abstract reativarAnuncio(): Promise<void>;
}
