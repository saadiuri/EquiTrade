import { MensagemRepository } from '../db/repositories/MensagemRepository';
import { Mensagem } from '../db/entities/Mensagem';
import { MensagemDto, ConversationDto } from '../dto/mensagem.dto';

export class MensagemService {
  private mensagemRepository: MensagemRepository;

  constructor() {
    this.mensagemRepository = new MensagemRepository();
  }

  async sendMessage(remetente_id: string, destinatario_id: string, conteudo: string): Promise<MensagemDto> {
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

    return this.toMensagemDto(mensagem);
  }

  async getMessageById(id: string): Promise<MensagemDto | null> {
    const mensagem = await this.mensagemRepository.findById(id);
    if (!mensagem) {
      throw new Error('Message not found');
    }
    return this.toMensagemDto(mensagem);
  }

  async getSentMessages(userId: string): Promise<MensagemDto[]> {
    const user = await this.mensagemRepository.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const mensagens = await this.mensagemRepository.findBySenderId(userId);
    return mensagens.map(msg => this.toMensagemDto(msg));
  }

  async getReceivedMessages(userId: string): Promise<MensagemDto[]> {
    const user = await this.mensagemRepository.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const mensagens = await this.mensagemRepository.findByReceiverId(userId);
    return mensagens.map(msg => this.toMensagemDto(msg));
  }

  async getConversation(userId1: string, userId2: string): Promise<ConversationDto> {
    const user1 = await this.mensagemRepository.findUserById(userId1);
    if (!user1) {
      throw new Error('User 1 not found');
    }

    const user2 = await this.mensagemRepository.findUserById(userId2);
    if (!user2) {
      throw new Error('User 2 not found');
    }

    const mensagens = await this.mensagemRepository.findConversation(userId1, userId2);
    
    return {
      otherUser: {
        id: user2.id,
        nome: user2.nome,
        email: user2.email
      },
      messages: mensagens.map(msg => this.toMensagemDto(msg)),
      totalMessages: mensagens.length
    };
  }

  private toMensagemDto(mensagem: Mensagem): MensagemDto {
    return {
      id: mensagem.id,
      conteudo: mensagem.conteudo,
      createAt: mensagem.createAt,
      remetente: {
        id: mensagem.remetente.id,
        nome: mensagem.remetente.nome,
        email: mensagem.remetente.email
      },
      destinatario: {
        id: mensagem.destinatario.id,
        nome: mensagem.destinatario.nome,
        email: mensagem.destinatario.email
      }
    };
  }

  async deleteMessage(id: string): Promise<boolean> {
    const mensagem = await this.mensagemRepository.findById(id);
    if (!mensagem) {
      throw new Error('Message not found');
    }

    return await this.mensagemRepository.delete(id);
  }
}

