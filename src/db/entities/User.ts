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

  // Métodos abstratos para implementação nas classes filhas
  abstract signUp(): Promise<void>;
  abstract login(email: string, senha: string): Promise<boolean>;
  abstract logout(): Promise<void>;
  abstract editarPerfil(dados: Partial<User>): Promise<void>;
  abstract enviarMensagem(destinatarioId: string, conteudo: string): Promise<Mensagem>;
}
