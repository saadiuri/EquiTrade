import { ChildEntity, Column } from 'typeorm';
import { User } from './User';
import { Mensagem } from './Mensagem';

@ChildEntity()
export class Vendedor extends User {
  @Column({ type: 'float', default: 0.0 })
  nota!: number;

  // Implementação dos métodos abstratos da classe pai
  async signUp(): Promise<void> {
    // TODO: Implementar lógica de cadastro do vendedor
    throw new Error('Method not implemented.');
  }

  async login(email: string, senha: string): Promise<boolean> {
    // TODO: Implementar lógica de login do vendedor
    throw new Error('Method not implemented.');
  }

  async logout(): Promise<void> {
    // TODO: Implementar lógica de logout do vendedor
    throw new Error('Method not implemented.');
  }

  async editarPerfil(dados: Partial<User>): Promise<void> {
    // TODO: Implementar lógica de edição de perfil do vendedor
    throw new Error('Method not implemented.');
  }

  async enviarMensagem(destinatarioId: string, conteudo: string): Promise<Mensagem> {
    // TODO: Implementar lógica de envio de mensagem do vendedor
    throw new Error('Method not implemented.');
  }

  // Métodos específicos do Vendedor
  async consultarAnuncio(): Promise<void> {
    // TODO: Implementar lógica de consultar anúncio
    throw new Error('Method not implemented.');
  }
}
