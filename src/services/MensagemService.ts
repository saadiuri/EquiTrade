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

  async getAllConversations(userId: string): Promise<ConversationDto[]> {
    const user = await this.mensagemRepository.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const sent = await this.mensagemRepository.findBySenderId(userId);
    const received = await this.mensagemRepository.findByReceiverId(userId);

    const uniqueUserIds = new Set<string>();
    sent.forEach(msg => uniqueUserIds.add(msg.destinatario.id));
    received.forEach(msg => uniqueUserIds.add(msg.remetente.id));

    const conversations: ConversationDto[] = [];

    for (const otherUserId of uniqueUserIds) {
      const otherUser = await this.mensagemRepository.findUserById(otherUserId);
      if (!otherUser) continue;

      const mensagens = await this.mensagemRepository.findConversation(userId, otherUserId);
      
      conversations.push({
        otherUser: {
          id: otherUser.id,
          nome: otherUser.nome,
          email: otherUser.email,
          type: otherUser.constructor.name
        },
        messages: mensagens.map(msg => this.toMensagemDto(msg)),
        totalMessages: mensagens.length
      });
    }

    return conversations;
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
        email: user2.email,
        type: user2.constructor.name
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

