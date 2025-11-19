import { Request, Response } from "express";
import { AnuncioService } from "../services/AnuncioService";
import {
  CreateAnuncioDto,
  UpdateAnuncioDto,
  FilterAnuncioDto,
} from "../dto/anuncio.dto";

/**
 * @swagger
 * tags:
 *   name: Anúncios
 *   description: Operações relacionadas ao gerenciamento de anúncios
 */
export class AnuncioController {
  private anuncioService: AnuncioService;

  constructor() {
    this.anuncioService = new AnuncioService();
  }

  /**
   * @swagger
   * /api/anuncios:
   *   get:
   *     summary: Buscar todos os anúncios
   *     description: Retorna uma lista de anúncios com filtros opcionais
   *     tags: [Anúncios]
   *     security: []
   *     parameters:
   *       - in: query
   *         name: ativo
   *         schema:
   *           type: boolean
   *         description: Filtrar por status ativo
   *       - in: query
   *         name: tipo
   *         schema:
   *           type: string
   *         description: Filtrar por tipo de anúncio
   *       - in: query
   *         name: precoMin
   *         schema:
   *           type: number
   *         description: Preço mínimo
   *       - in: query
   *         name: precoMax
   *         schema:
   *           type: number
   *         description: Preço máximo
   *       - in: query
   *         name: vendedorId
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID do vendedor
   *       - in: query
   *         name: cavaloId
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID do cavalo
   *     responses:
   *       200:
   *         description: Lista de anúncios retornada com sucesso
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
   *                         $ref: '#/components/schemas/AnuncioDto'
   *       500:
   *         description: Erro interno do servidor
   */
  async getAllAnuncios(req: Request, res: Response): Promise<void> {
    try {
      const filters: FilterAnuncioDto = {
        ativo: req.query.ativo ? req.query.ativo === 'true' : undefined,
        tipo: req.query.tipo as string,
        precoMin: req.query.precoMin ? Number(req.query.precoMin) : undefined,
        precoMax: req.query.precoMax ? Number(req.query.precoMax) : undefined,
        vendedorId: req.query.vendedorId as string,
        cavaloId: req.query.cavaloId as string,
      };

      Object.keys(filters).forEach(key => 
        filters[key as keyof FilterAnuncioDto] === undefined && delete filters[key as keyof FilterAnuncioDto]
      );

      const anuncios = Object.keys(filters).length > 0 
        ? await this.anuncioService.getAnunciosByFilters(filters)
        : await this.anuncioService.getAllAnuncios();

      res.json({
        success: true,
        count: anuncios.length,
        data: anuncios,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch anúncios",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * @swagger
   * /api/anuncios/{id}:
   *   get:
   *     summary: Buscar anúncio por ID
   *     description: Retorna um anúncio específico pelo seu ID
   *     tags: [Anúncios]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID único do anúncio
   *     responses:
   *       200:
   *         description: Anúncio encontrado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/AnuncioDto'
   *       400:
   *         description: ID inválido
   *       404:
   *         description: Anúncio não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  async getAnuncioById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid anúncio ID format (UUID expected)",
        });
        return;
      }

      const anuncio = await this.anuncioService.getAnuncioById(id);

      res.json({
        success: true,
        data: anuncio,
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === "Anúncio not found" ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message: "Failed to fetch anúncio",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * @swagger
   * /api/anuncios/vendedor/{vendedorId}:
   *   get:
   *     summary: Buscar anúncios por vendedor
   *     description: Retorna todos os anúncios de um vendedor específico
   *     tags: [Anúncios]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: vendedorId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID único do vendedor
   *     responses:
   *       200:
   *         description: Lista de anúncios do vendedor
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
   *                         $ref: '#/components/schemas/AnuncioDto'
   *       400:
   *         description: ID do vendedor inválido
   *       404:
   *         description: Vendedor não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  async getAnunciosByVendedor(req: Request, res: Response): Promise<void> {
    try {
      const vendedorId = req.params.vendedorId;
      if (!vendedorId || typeof vendedorId !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid seller ID format (UUID expected)",
        });
        return;
      }

      const anuncios = await this.anuncioService.getAnunciosByVendedor(vendedorId);
      res.json({
        success: true,
        count: anuncios.length,
        data: anuncios,
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === "Seller not found" ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message: "Failed to fetch anúncios by seller",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * @swagger
   * /api/anuncios:
   *   post:
   *     summary: Cadastrar novo anúncio
   *     description: Cria um novo anúncio na plataforma
   *     tags: [Anúncios]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateAnuncioDto'
   *     responses:
   *       201:
   *         description: Anúncio criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/AnuncioDto'
   *       400:
   *         description: Dados inválidos
   *       404:
   *         description: Vendedor ou cavalo não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  async createAnuncio(req: Request, res: Response): Promise<void> {
    try {
      const { titulo, tipo, descricao, preco, ativo, vendedorId, cavaloId } = req.body;

      if (!titulo || !tipo || !preco || !vendedorId || !cavaloId) {
        res.status(400).json({
          success: false,
          message: "Titulo, tipo, preco, vendedorId, and cavaloId are required",
        });
        return;
      }

      if (typeof preco !== 'number') {
        res.status(400).json({
          success: false,
          message: "Preco must be a number",
        });
        return;
      }

      const anuncioData: CreateAnuncioDto = {
        titulo,
        tipo,
        descricao,
        preco,
        ativo,
        vendedorId,
        cavaloId,
      };

      const anuncio = await this.anuncioService.createAnuncio(anuncioData);

      res.status(201).json({
        success: true,
        message: "Anúncio created successfully",
        data: anuncio,
      });
    } catch (error) {
      let statusCode = 500;
      if (error instanceof Error) {
        if (error.message.includes("not found")) statusCode = 404;
        if (error.message.includes("must be")) statusCode = 400;
      }

      res.status(statusCode).json({
        success: false,
        message: "Failed to create anúncio",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * @swagger
   * /api/anuncios/{id}:
   *   put:
   *     summary: Atualizar anúncio
   *     description: Atualiza dados de um anúncio existente
   *     tags: [Anúncios]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID único do anúncio
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateAnuncioDto'
   *     responses:
   *       200:
   *         description: Anúncio atualizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/AnuncioDto'
   *       400:
   *         description: Dados inválidos
   *       404:
   *         description: Anúncio não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  async updateAnuncio(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid anúncio ID format (UUID expected)",
        });
        return;
      }

      const updateData: UpdateAnuncioDto = req.body;

      if (updateData.preco !== undefined && typeof updateData.preco !== 'number') {
        res.status(400).json({
          success: false,
          message: "Preco must be a number",
        });
        return;
      }

      const anuncio = await this.anuncioService.updateAnuncio(id, updateData);

      res.json({
        success: true,
        message: "Anúncio updated successfully",
        data: anuncio,
      });
    } catch (error) {
      let statusCode = 500;
      if (error instanceof Error) {
        if (error.message === "Anúncio not found") statusCode = 404;
        if (error.message.includes("must be")) statusCode = 400;
      }

      res.status(statusCode).json({
        success: false,
        message: "Failed to update anúncio",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * @swagger
   * /api/anuncios/{id}:
   *   delete:
   *     summary: Excluir anúncio
   *     description: Remove um anúncio da plataforma
   *     tags: [Anúncios]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID único do anúncio
   *     responses:
   *       200:
   *         description: Anúncio excluído com sucesso
   *       400:
   *         description: ID inválido
   *       404:
   *         description: Anúncio não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  async deleteAnuncio(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid anúncio ID format (UUID expected)",
        });
        return;
      }

      const deleted = await this.anuncioService.deleteAnuncio(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: "Anúncio not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Anúncio deleted successfully",
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === "Anúncio not found" ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message: "Failed to delete anúncio",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * @swagger
   * /api/anuncios/{id}/inactive:
   *   put:
   *     summary: Marcar anúncio como inativo
   *     description: Marca um anúncio como inativo
   *     tags: [Anúncios]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Anúncio marcado como inativo
   *       400:
   *         description: Anúncio já está inativo
   *       404:
   *         description: Anúncio não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  async markAnuncioAsInactive(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid anúncio ID format (UUID expected)",
        });
        return;
      }

      const anuncio = await this.anuncioService.markAnuncioAsInactive(id);

      res.json({
        success: true,
        message: "Anúncio marked as inactive successfully",
        data: anuncio,
      });
    } catch (error) {
      let statusCode = 500;
      if (error instanceof Error) {
        if (error.message === "Anúncio not found") statusCode = 404;
        if (error.message.includes("already")) statusCode = 400;
      }

      res.status(statusCode).json({
        success: false,
        message: "Failed to mark anúncio as inactive",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * @swagger
   * /api/anuncios/{id}/active:
   *   put:
   *     summary: Marcar anúncio como ativo
   *     description: Marca um anúncio como ativo novamente
   *     tags: [Anúncios]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Anúncio marcado como ativo
   *       400:
   *         description: Anúncio já está ativo
   *       404:
   *         description: Anúncio não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  async markAnuncioAsActive(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid anúncio ID format (UUID expected)",
        });
        return;
      }

      const anuncio = await this.anuncioService.markAnuncioAsActive(id);

      res.json({
        success: true,
        message: "Anúncio marked as active successfully",
        data: anuncio,
      });
    } catch (error) {
      let statusCode = 500;
      if (error instanceof Error) {
        if (error.message === "Anúncio not found") statusCode = 404;
        if (error.message.includes("already")) statusCode = 400;
      }

      res.status(statusCode).json({
        success: false,
        message: "Failed to mark anúncio as active",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

}

