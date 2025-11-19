import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { Mensagem } from '../entities/Mensagem';
import { User } from '../entities/User';

export class MensagemRepository {
  private mensagemRepository: Repository<Mensagem>;
  private userRepository: Repository<User>;

  constructor() {
    this.mensagemRepository = AppDataSource.getRepository(Mensagem);
    this.userRepository = AppDataSource.getRepository(User);
  }

  async findById(id: string): Promise<Mensagem | null> {
    return await this.mensagemRepository.findOne({
      where: { id },
      relations: ['remetente', 'destinatario']
    });
  }

  async findBySenderId(senderId: string): Promise<Mensagem[]> {
    return await this.mensagemRepository.find({
      where: { remetente: { id: senderId } },
      relations: ['remetente', 'destinatario'],
      order: { createAt: 'DESC' }
    });
  }

  async findByReceiverId(receiverId: string): Promise<Mensagem[]> {
    return await this.mensagemRepository.find({
      where: { destinatario: { id: receiverId } },
      relations: ['remetente', 'destinatario'],
      order: { createAt: 'DESC' }
    });
  }

  async findConversation(userId1: string, userId2: string): Promise<Mensagem[]> {
    return await this.mensagemRepository.find({
      where: [
        { 
          remetente: { id: userId1 }, 
          destinatario: { id: userId2 } 
        },
        { 
          remetente: { id: userId2 }, 
          destinatario: { id: userId1 } 
        }
      ],
      relations: ['remetente', 'destinatario'],
      order: { createAt: 'ASC' }
    });
  }

  async create(mensagemData: Partial<Mensagem>): Promise<Mensagem> {
    const mensagem = this.mensagemRepository.create(mensagemData);
    return await this.mensagemRepository.save(mensagem);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.mensagemRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findUserById(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id: userId }
    });
  }

}

