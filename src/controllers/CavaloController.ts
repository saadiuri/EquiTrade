import { Request, Response } from "express";
import { CavaloService } from "../services/CavaloService";
import {
  CreateCavaloDto,
  UpdateCavaloDto,
  FilterCavaloDto,
} from "../dto/cavalo.dto";

/**
 * @swagger
 * tags:
 *   name: Cavalos
 *   description: Operações relacionadas ao gerenciamento de cavalos
 */
export class CavaloController {
  private cavaloService: CavaloService;

  constructor() {
    this.cavaloService = new CavaloService();
  }

  /**
   * @swagger
   * /api/cavalos:
   *   get:
   *     summary: Buscar todos os cavalos
   *     description: Retorna uma lista de cavalos com filtros opcionais
   *     tags: [Cavalos]
   *     security: []
   *     parameters:
   *       - in: query
   *         name: disponivel
   *         schema:
   *           type: boolean
   *         description: Filtrar por disponibilidade
   *       - in: query
   *         name: raca
   *         schema:
   *           type: string
   *         description: Filtrar por raça (busca parcial)
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
   *         name: idadeMin
   *         schema:
   *           type: integer
   *         description: Idade mínima
   *       - in: query
   *         name: idadeMax
   *         schema:
   *           type: integer
   *         description: Idade máxima
   *       - in: query
   *         name: donoId
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID do proprietário
   *     responses:
   *       200:
   *         description: Lista de cavalos retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     count:
   *                       type: integer
   *                       description: Número de cavalos encontrados
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/CavaloDto'
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   */
  async getAllCavalos(req: Request, res: Response): Promise<void> {
    try {
      const filters: FilterCavaloDto = {
        disponivel: req.query.disponivel ? req.query.disponivel === 'true' : undefined,
        racaContains: req.query.raca as string,
        precoMin: req.query.precoMin ? Number(req.query.precoMin) : undefined,
        precoMax: req.query.precoMax ? Number(req.query.precoMax) : undefined,
        idadeMin: req.query.idadeMin ? Number(req.query.idadeMin) : undefined,
        idadeMax: req.query.idadeMax ? Number(req.query.idadeMax) : undefined,
        donoId: req.query.donoId as string,
      };

      // Remove undefined values
      Object.keys(filters).forEach(key =>
        filters[key as keyof FilterCavaloDto] === undefined && delete filters[key as keyof FilterCavaloDto]
      );

      const cavalos = Object.keys(filters).length > 0
        ? await this.cavaloService.getCavalosByFilters(filters)
        : await this.cavaloService.getAllCavalos();

      res.json({
        success: true,
        count: cavalos.length,
        data: cavalos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch cavalos",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * @swagger
   * /api/cavalos/{id}:
   *   get:
   *     summary: Buscar cavalo por ID
   *     description: Retorna um cavalo específico pelo seu ID
   *     tags: [Cavalos]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID único do cavalo
   *     responses:
   *       200:
   *         description: Cavalo encontrado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/CavaloDto'
   *       400:
   *         description: ID inválido
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       404:
   *         description: Cavalo não encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   */
  async getCavaloById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid cavalo ID format (UUID expected)",
        });
        return;
      }

      const cavalo = await this.cavaloService.getCavaloById(id);
      if (!cavalo) {
        res.status(404).json({
          success: false,
          message: "Cavalo not found",
        });
        return;
      }

      res.json({
        success: true,
        data: cavalo,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch cavalo",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * @swagger
   * /api/cavalos/dono/{donoId}:
   *   get:
   *     summary: Buscar cavalos por proprietário
   *     description: Retorna todos os cavalos de um proprietário específico
   *     tags: [Cavalos]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: donoId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID único do proprietário
   *     responses:
   *       200:
   *         description: Lista de cavalos do proprietário retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     count:
   *                       type: integer
   *                       description: Número de cavalos encontrados
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/CavaloDto'
   *       400:
   *         description: ID do proprietário inválido
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   */
  async getCavalosByDono(req: Request, res: Response): Promise<void> {
    try {
      const donoId = req.params.donoId;
      if (!donoId || typeof donoId !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid dono ID format (UUID expected)",
        });
        return;
      }

      const cavalos = await this.cavaloService.getCavalosByDono(donoId);
      res.json({
        success: true,
        count: cavalos.length,
        data: cavalos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch cavalos by dono",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * @swagger
   * /api/cavalos:
   *   post:
   *     summary: Cadastrar novo cavalo
   *     description: Cria um novo cavalo na plataforma
   *     tags: [Cavalos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCavaloDto'
   *     responses:
   *       201:
   *         description: Cavalo criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/CavaloDto'
   *       400:
   *         description: Dados inválidos ou validação falhou
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       404:
   *         description: Proprietário não encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   */
  async createCavalo(req: Request, res: Response): Promise<void> {
    try {
      const { nome, idade, raca, preco, descricao, disponivel, premios, donoId } = req.body;

      // Basic validation
      if (!nome || !idade || !raca || !preco || !donoId) {
        res.status(400).json({
          success: false,
          message: "Nome, idade, raca, preco, and donoId are required",
        });
        return;
      }

      // Type validation
      if (typeof idade !== 'number' || typeof preco !== 'number') {
        res.status(400).json({
          success: false,
          message: "Idade and preco must be numbers",
        });
        return;
      }

      const cavaloData: CreateCavaloDto = {
        nome,
        idade,
        raca,
        preco,
        descricao,
        disponivel,
        premios,
        donoId,
      };

      const cavalo = await this.cavaloService.createCavalo(cavaloData);

      res.status(201).json({
        success: true,
        message: "Cavalo created successfully",
        data: cavalo,
      });
    } catch (error) {
      let statusCode = 500;
      if (error instanceof Error) {
        if (error.message === "Dono (owner) not found") statusCode = 404;
        if (error.message.includes("must be")) statusCode = 400;
      }

      res.status(statusCode).json({
        success: false,
        message: "Failed to create cavalo",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * @swagger
   * /api/cavalos/{id}:
   *   put:
   *     summary: Atualizar cavalo
   *     description: Atualiza dados de um cavalo existente
   *     tags: [Cavalos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID único do cavalo
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateCavaloDto'
   *     responses:
   *       200:
   *         description: Cavalo atualizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/CavaloDto'
   *       400:
   *         description: Dados inválidos ou ID inválido
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       404:
   *         description: Cavalo não encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   */
  async updateCavalo(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid cavalo ID format (UUID expected)",
        });
        return;
      }

      const updateData: UpdateCavaloDto = req.body;

      // Type validation for numeric fields if provided
      if (updateData.idade !== undefined && typeof updateData.idade !== 'number') {
        res.status(400).json({
          success: false,
          message: "Idade must be a number",
        });
        return;
      }

      if (updateData.preco !== undefined && typeof updateData.preco !== 'number') {
        res.status(400).json({
          success: false,
          message: "Preco must be a number",
        });
        return;
      }

      const cavalo = await this.cavaloService.updateCavalo(id, updateData);

      res.json({
        success: true,
        message: "Cavalo updated successfully",
        data: cavalo,
      });
    } catch (error) {
      let statusCode = 500;
      if (error instanceof Error) {
        if (error.message === "Cavalo not found") statusCode = 404;
        if (error.message.includes("must be")) statusCode = 400;
      }

      res.status(statusCode).json({
        success: false,
        message: "Failed to update cavalo",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * @swagger
   * /api/cavalos/{id}:
   *   delete:
   *     summary: Excluir cavalo
   *     description: Remove um cavalo da plataforma
   *     tags: [Cavalos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID único do cavalo
   *     responses:
   *       200:
   *         description: Cavalo excluído com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       400:
   *         description: ID inválido
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       404:
   *         description: Cavalo não encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   */
  async deleteCavalo(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid cavalo ID format (UUID expected)",
        });
        return;
      }

      const deleted = await this.cavaloService.deleteCavalo(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: "Cavalo not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Cavalo deleted successfully",
      });
    } catch (error) {
      let statusCode = 500;
      if (error instanceof Error) {
        if (error.message === "Cavalo not found") statusCode = 404;
      }

      res.status(statusCode).json({
        success: false,
        message: "Failed to delete cavalo",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * @swagger
   * /api/cavalos/{id}/unavailable:
   *   put:
   *     summary: Marcar cavalo como indisponível
   *     description: Marca um cavalo como indisponível (vendido)
   *     tags: [Cavalos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID único do cavalo
   *     responses:
   *       200:
   *         description: Cavalo marcado como indisponível com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/CavaloDto'
   *       400:
   *         description: ID inválido ou cavalo já indisponível
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       404:
   *         description: Cavalo não encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   */
  async markCavaloAsUnavailable(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid cavalo ID format (UUID expected)",
        });
        return;
      }

      const cavalo = await this.cavaloService.markCavaloAsUnavailable(id);

      res.json({
        success: true,
        message: "Cavalo marked as unavailable successfully",
        data: cavalo,
      });
    } catch (error) {
      let statusCode = 500;
      if (error instanceof Error) {
        if (error.message === "Cavalo not found") statusCode = 404;
        if (error.message.includes("already")) statusCode = 400;
      }

      res.status(statusCode).json({
        success: false,
        message: "Failed to mark cavalo as unavailable",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * @swagger
   * /api/cavalos/{id}/available:
   *   put:
   *     summary: Marcar cavalo como disponível
   *     description: Marca um cavalo como disponível novamente
   *     tags: [Cavalos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID único do cavalo
   *     responses:
   *       200:
   *         description: Cavalo marcado como disponível com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/ApiResponse'
   *                 - type: object
   *                   properties:
   *                     data:
   *                       $ref: '#/components/schemas/CavaloDto'
   *       400:
   *         description: ID inválido ou cavalo já disponível
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       404:
   *         description: Cavalo não encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   */
  async markCavaloAsAvailable(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid cavalo ID format (UUID expected)",
        });
        return;
      }

      const cavalo = await this.cavaloService.markCavaloAsAvailable(id);

      res.json({
        success: true,
        message: "Cavalo marked as available successfully",
        data: cavalo,
      });
    } catch (error) {
      let statusCode = 500;
      if (error instanceof Error) {
        if (error.message === "Cavalo not found") statusCode = 404;
        if (error.message.includes("already")) statusCode = 400;
      }

      res.status(statusCode).json({
        success: false,
        message: "Failed to mark cavalo as available",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // BUSCAR CAVALO POR TERMO
  // GET /api/cavalos?nome=termo
  async buscarCavalos(req: Request, res: Response) {
    try {
      const { nome, raca, disponivel } = req.query;

      // Converte disponivel para boolean se passado
      const filtros: any = {};
      if (nome) filtros.nome = String(nome);
      if (raca) filtros.raca = String(raca);
      if (disponivel !== undefined) filtros.disponivel = disponivel === 'true';

      const cavalos = await this.cavaloService.getCavalosByFilters(filtros);

      res.status(200).json({
        success: true,
        data: cavalos
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar cavalos',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  }

  // GET /api/cavalos
  async listarTodosCavalos(req: Request, res: Response) {
    try {
      const cavalos = await this.cavaloService.getAllCavalos();
      res.status(200).json({
        success: true,
        data: cavalos
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Erro ao listar cavalos',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  }

}
