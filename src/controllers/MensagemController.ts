import { Request, Response } from "express";
import { MensagemService } from "../services/MensagemService";

/**
 * @swagger
 * tags:
 *   name: Mensagens
 *   description: Operações relacionadas ao sistema de mensagens entre usuários
 */
export class MensagemController {
  private mensagemService: MensagemService;

  constructor() {
    this.mensagemService = new MensagemService();
  }

  /**
   * @swagger
   * /api/mensagens:
   *   post:
   *     summary: Enviar mensagem
   *     description: Envia uma nova mensagem de um usuário para outro
   *     tags: [Mensagens]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateMensagemDto'
   *     responses:
   *       201:
   *         description: Mensagem enviada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/MensagemDto'
   *       400:
   *         description: Dados inválidos ou campos obrigatórios ausentes
   *       404:
   *         description: Remetente ou destinatário não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { destinatario_id, conteudo } = req.body;

      if (!destinatario_id || !conteudo) {
        res.status(400).json({
          success: false,
          message: "destinatario_id and conteudo are required",
        });
        return;
      }

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });
        return;
      }

      const mensagem = await this.mensagemService.sendMessage(
        req.user.userId,
        destinatario_id,
        conteudo
      );

      res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: mensagem,
      });
    } catch (error) {
      let statusCode = 500;
      if (error instanceof Error) {
        if (error.message.includes("not found")) statusCode = 404;
        if (error.message.includes("cannot be empty")) statusCode = 400;
      }

      res.status(statusCode).json({
        success: false,
        message: "Failed to send message",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * @swagger
   * /api/mensagens/{id}:
   *   get:
   *     summary: Buscar mensagem por ID
   *     description: Retorna uma mensagem específica pelo seu ID
   *     tags: [Mensagens]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID único da mensagem
   *     responses:
   *       200:
   *         description: Mensagem encontrada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/MensagemDto'
   *       400:
   *         description: ID inválido
   *       404:
   *         description: Mensagem não encontrada
   *       500:
   *         description: Erro interno do servidor
   */
  async getMessageById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      if (!id || typeof id !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid message ID format (UUID expected)",
        });
        return;
      }

      const mensagem = await this.mensagemService.getMessageById(id);

      res.json({
        success: true,
        data: mensagem,
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === "Message not found" ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message: "Failed to fetch message",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * @swagger
   * /api/mensagens/sent:
   *   get:
   *     summary: Buscar mensagens enviadas
   *     description: Retorna todas as mensagens enviadas pelo usuário autenticado
   *     tags: [Mensagens]
   *     responses:
   *       200:
   *         description: Lista de mensagens enviadas retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     count:
   *                       type: integer
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/MensagemDto'
   *       400:
   *         description: userId é obrigatório
   *       404:
   *         description: Usuário não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  async getSentMessages(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });
        return;
      }

      const mensagens = await this.mensagemService.getSentMessages(req.user.userId);

      res.json({
        success: true,
        count: mensagens.length,
        data: mensagens,
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === "User not found" ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message: "Failed to fetch sent messages",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * @swagger
   * /api/mensagens/received:
   *   get:
   *     summary: Buscar mensagens recebidas
   *     description: Retorna todas as mensagens recebidas pelo usuário autenticado
   *     tags: [Mensagens]
   *     responses:
   *       200:
   *         description: Lista de mensagens recebidas retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     count:
   *                       type: integer
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/MensagemDto'
   *       400:
   *         description: userId é obrigatório
   *       404:
   *         description: Usuário não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  async getReceivedMessages(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });
        return;
      }

      const mensagens = await this.mensagemService.getReceivedMessages(req.user.userId);

      res.json({
        success: true,
        count: mensagens.length,
        data: mensagens,
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === "User not found" ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message: "Failed to fetch received messages",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * @swagger
   * /api/mensagens/conversations:
   *   get:
   *     summary: Listar todas as conversas
   *     description: Retorna todas as conversas do usuário autenticado
   *     tags: [Mensagens]
   *     responses:
   *       200:
   *         description: Lista de conversas retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     count:
   *                       type: integer
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/ConversationDto'
   *       401:
   *         description: Não autenticado
   *       404:
   *         description: Usuário não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  async getAllConversations(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });
        return;
      }

      const conversations = await this.mensagemService.getAllConversations(req.user.userId);

      res.json({
        success: true,
        count: conversations.length,
        data: conversations,
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === "User not found" ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message: "Failed to fetch conversations",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * @swagger
   * /api/mensagens/conversation/{userId}:
   *   get:
   *     summary: Buscar conversa com usuário
   *     description: Retorna todas as mensagens trocadas entre o usuário autenticado e outro usuário
   *     tags: [Mensagens]
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID do outro usuário na conversa
   *     responses:
   *       200:
   *         description: Conversa retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/ConversationDto'
   *       400:
   *         description: IDs inválidos ou ausentes
   *       404:
   *         description: Usuário não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  async getConversation(req: Request, res: Response): Promise<void> {
    try {
      const otherUserId = req.params.userId;

      if (!otherUserId || typeof otherUserId !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid user ID format (UUID expected)",
        });
        return;
      }

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });
        return;
      }

      const conversation = await this.mensagemService.getConversation(req.user.userId, otherUserId);

      res.json({
        success: true,
        data: conversation,
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes("not found") ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message: "Failed to fetch conversation",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * @swagger
   * /api/mensagens/{id}:
   *   delete:
   *     summary: Excluir mensagem
   *     description: Remove uma mensagem do sistema
   *     tags: [Mensagens]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID único da mensagem
   *     responses:
   *       200:
   *         description: Mensagem excluída com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       400:
   *         description: ID inválido
   *       404:
   *         description: Mensagem não encontrada
   *       500:
   *         description: Erro interno do servidor
   */
  async deleteMessage(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      if (!id || typeof id !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid message ID format (UUID expected)",
        });
        return;
      }

      const deleted = await this.mensagemService.deleteMessage(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: "Message not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Message deleted successfully",
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === "Message not found" ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message: "Failed to delete message",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}


