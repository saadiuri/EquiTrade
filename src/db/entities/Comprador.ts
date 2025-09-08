import { ChildEntity } from 'typeorm';
import { User } from './User';
import { Mensagem } from './Mensagem';

@ChildEntity()
export class Comprador extends User {
  // Implementação dos métodos abstratos da classe pai
  async signUp(): Promise<void> {
    // TODO: Implementar lógica de cadastro do comprador
    throw new Error('Method not implemented.');
  }

  async login(email: string, senha: string): Promise<boolean> {
    // TODO: Implementar lógica de login do comprador
    throw new Error('Method not implemented.');
  }

  async logout(): Promise<void> {
    // TODO: Implementar lógica de logout do comprador
    throw new Error('Method not implemented.');
  }

  async editarPerfil(dados: Partial<User>): Promise<void> {
    // TODO: Implementar lógica de edição de perfil do comprador
    throw new Error('Method not implemented.');
  }

  async enviarMensagem(destinatarioId: string, conteudo: string): Promise<Mensagem> {
    // TODO: Implementar lógica de envio de mensagem do comprador
    throw new Error('Method not implemented.');
  }

  // Métodos específicos do Comprador
  async consultarAnuncio(): Promise<void> {
    // TODO: Implementar lógica de consultar anúncio
    throw new Error('Method not implemented.');
  }

  async avaliarVendedor(): Promise<void> {
    // TODO: Implementar lógica de avaliar vendedor
    throw new Error('Method not implemented.');
  }
}
