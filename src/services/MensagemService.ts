import { MensagemRepository } from '../db/repositories/MensagemRepository';
import { Mensagem } from '../db/entities/Mensagem';

export class MensagemService {
  private mensagemRepository: MensagemRepository;

  constructor() {
    this.mensagemRepository = new MensagemRepository();
  }

  async sendMessage(remetente_id: string, destinatario_id: string, conteudo: string): Promise<Mensagem> {
    const remetente = await this.mensagemRepository.findUserById(remetente_id);
    if (!remetente) {
      throw new Error('Sender not found');
    }

    const destinatario = await this.mensagemRepository.findUserById(destinatario_id);
    if (!destinatario) {
      throw new Error('Receiver not found');
    }

    if (!conteudo || conteudo.trim().length === 0) {
      throw new Error('Message content cannot be empty');
    }

    const mensagem = await this.mensagemRepository.create({
      conteudo: conteudo.trim(),
      remetente,
      destinatario
    });

    return mensagem;
  }

  async getMessageById(id: string): Promise<Mensagem | null> {
    const mensagem = await this.mensagemRepository.findById(id);
    if (!mensagem) {
      throw new Error('Message not found');
    }
    return mensagem;
  }

  async getSentMessages(userId: string): Promise<Mensagem[]> {
    const user = await this.mensagemRepository.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return await this.mensagemRepository.findBySenderId(userId);
  }

  async getReceivedMessages(userId: string): Promise<Mensagem[]> {
    const user = await this.mensagemRepository.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return await this.mensagemRepository.findByReceiverId(userId);
  }

  async getConversation(userId1: string, userId2: string): Promise<Mensagem[]> {
    const user1 = await this.mensagemRepository.findUserById(userId1);
    if (!user1) {
      throw new Error('User 1 not found');
    }

    const user2 = await this.mensagemRepository.findUserById(userId2);
    if (!user2) {
      throw new Error('User 2 not found');
    }

    return await this.mensagemRepository.findConversation(userId1, userId2);
  }

  async deleteMessage(id: string): Promise<boolean> {
    const mensagem = await this.mensagemRepository.findById(id);
    if (!mensagem) {
      throw new Error('Message not found');
    }

    return await this.mensagemRepository.delete(id);
  }
}

