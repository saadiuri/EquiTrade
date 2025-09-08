import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('mensagens')
export class Mensagem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  conteudo!: string;

  @CreateDateColumn()
  createAt!: Date;

  // Relacionamentos
  @ManyToOne(() => User, user => user.mensagensEnviadas)
  @JoinColumn({ name: 'remetente_id' })
  remetente!: User;

  @Column({ type: 'uuid' })
  remetente_id!: string;

  @ManyToOne(() => User, user => user.mensagensRecebidas)
  @JoinColumn({ name: 'destinatario_id' })
  destinatario!: User;

  @Column({ type: 'uuid' })
  destinatario_id!: string;
}
