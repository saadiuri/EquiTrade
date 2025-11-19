export interface MensagemDto {
  id: string;
  conteudo: string;
  createAt: Date;
  remetente: {
    id: string;
    nome: string;
    email: string;
  };
  destinatario: {
    id: string;
    nome: string;
    email: string;
  };
}

export interface CreateMensagemDto {
  destinatario_id: string;
  conteudo: string;
}

export interface ConversationDto {
  otherUser: {
    id: string;
    nome: string;
    email: string;
  };
  messages: MensagemDto[];
  totalMessages: number;
}

