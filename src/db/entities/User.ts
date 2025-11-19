import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, TableInheritance, OneToMany } from 'typeorm';
import { Mensagem } from './Mensagem';

@Entity('users')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  nome!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  senha!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  celular?: string;

  @Column({ type: 'text', nullable: true })
  endereco?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relacionamentos
  @OneToMany(() => Mensagem, mensagem => mensagem.remetente)
  mensagensEnviadas!: Mensagem[];

  @OneToMany(() => Mensagem, mensagem => mensagem.destinatario)
  mensagensRecebidas!: Mensagem[];
}
