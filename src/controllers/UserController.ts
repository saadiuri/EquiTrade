import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { AuthService } from "../services/AuthService";
import {
  CreateUserDto,
  UpdateUserDto,
  CreateCompradorDto,
  CreateVendedorDto,
  USER_TYPE,
} from "../dto/user.dto";
import { LoginDto, RegisterDto } from "../dto/auth.dto";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação e gerenciamento de sessão
 */
export class UserController {
  private userService: UserService;
  private authService: AuthService;

  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
  }

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Login de usuário
   *     description: Autentica um usuário e retorna um token JWT
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - senha
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: maria@equitrade.com
   *               senha:
   *                 type: string
   *                 format: password
   *                 example: password123
   *     responses:
   *       200:
   *         description: Login realizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     token:
   *                       type: string
   *                       description: Token JWT para autenticação
   *                     user:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: string
   *                           format: uuid
   *                         nome:
   *                           type: string
   *                         email:
   *                           type: string
   *                         tipo:
   *                           type: string
   *                           enum: [Comprador, Vendedor]
   *       400:
   *         description: Dados inválidos
   *       401:
   *         description: Email ou senha inválidos
   *       500:
   *         description: Erro interno do servidor
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginDto = req.body;

      if (!loginData.email || !loginData.senha) {
        res.status(400).json({
          success: false,
          message: "Email e senha são obrigatórios",
        });
        return;
      }

      const authResponse = await this.authService.login(loginData);

      res.json({
        success: true,
        data: authResponse,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      const statusCode = message.includes("inválidos") ? 401 : 500;

      res.status(statusCode).json({
        success: false,
        message: message,
      });
    }
  }

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Cadastro de novo usuário
   *     description: Registra um novo usuário (Comprador ou Vendedor) e retorna um token JWT
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nome
   *               - email
   *               - senha
   *               - tipo
   *             properties:
   *               nome:
   *                 type: string
   *                 example: João Silva
   *               email:
   *                 type: string
   *                 format: email
   *                 example: joao@example.com
   *               senha:
   *                 type: string
   *                 format: password
   *                 example: senha123
   *               celular:
   *                 type: string
   *                 example: (11) 99999-9999
   *               endereco:
   *                 type: string
   *                 example: São Paulo, SP
   *               tipo:
   *                 type: string
   *                 enum: [Comprador, Vendedor]
   *                 example: Comprador
   *               nota:
   *                 type: number
   *                 description: Nota inicial do vendedor (apenas para tipo Vendedor)
   *                 example: 0
   *     responses:
   *       201:
   *         description: Usuário cadastrado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     token:
   *                       type: string
   *                     user:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: string
   *                           format: uuid
   *                         nome:
   *                           type: string
   *                         email:
   *                           type: string
   *                         tipo:
   *                           type: string
   *       400:
   *         description: Dados inválidos ou email já cadastrado
   *       500:
   *         description: Erro interno do servidor
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const registerData: RegisterDto = req.body;

      if (!registerData.nome || !registerData.email || !registerData.senha || !registerData.tipo) {
        res.status(400).json({
          success: false,
          message: "Nome, email, senha e tipo são obrigatórios",
        });
        return;
      }

      if (!['Comprador', 'Vendedor'].includes(registerData.tipo)) {
        res.status(400).json({
          success: false,
          message: "Tipo deve ser 'Comprador' ou 'Vendedor'",
        });
        return;
      }

      const authResponse = await this.authService.register(registerData);

      res.status(201).json({
        success: true,
        data: authResponse,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      const statusCode = message.includes("já cadastrado") ? 400 : 500;

      res.status(statusCode).json({
        success: false,
        message: message,
      });
    }
  }

  // GET /api/users - Get all users (both Compradores and Vendedores)
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // GET /api/users/compradores - Get all Compradores
  async getAllCompradores(req: Request, res: Response): Promise<void> {
    try {
      const compradores = await this.userService.getAllCompradores();
      res.json({
        success: true,
        count: compradores.length,
        data: compradores,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch compradores",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // GET /api/users/vendedores - Get all Vendedores
  async getAllVendedores(req: Request, res: Response): Promise<void> {
    try {
      const vendedores = await this.userService.getAllVendedores();
      res.json({
        success: true,
        count: vendedores.length,
        data: vendedores,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch vendedores",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // GET /api/users/:id - Get user by ID (UUID)
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid user ID format (UUID expected)",
        });
        return;
      }

      const user = await this.userService.getUserById(id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // POST /api/users - Create user (polymorphic)
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { type, data } = req.body;

      // Validate type
      if (!type || (type !== USER_TYPE.COMPRADOR && type !== USER_TYPE.VENDEDOR)) {
        res.status(400).json({
          success: false,
          message:
            'Type is required and must be either "Comprador" or "Vendedor"',
        });
        return;
      }

      // Validate required fields
      if (!data || !data.nome || !data.email || !data.senha) {
        res.status(400).json({
          success: false,
          message: "Nome, email, and senha are required",
        });
        return;
      }

      const userData: CreateUserDto = { type, data };
      const user = await this.userService.createUser(userData);

      res.status(201).json({
        success: true,
        message: `${type} created successfully`,
        data: user,
      });
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message === "Email already exists"
          ? 409
          : 500;
      res.status(statusCode).json({
        success: false,
        message: "Failed to create user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // POST /api/users/compradores - Create Comprador specifically
  async createComprador(req: Request, res: Response): Promise<void> {
    try {
      const { nome, email, senha, celular, endereco } = req.body;

      // Basic validation
      if (!nome || !email || !senha) {
        res.status(400).json({
          success: false,
          message: "Nome, email, and senha are required",
        });
        return;
      }

      const userData: CreateCompradorDto = {
        nome,
        email,
        senha,
        celular,
        endereco,
      };

      const comprador = await this.userService.createComprador(userData);

      res.status(201).json({
        success: true,
        message: "Comprador created successfully",
        data: comprador,
      });
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message === "Email already exists"
          ? 409
          : 500;
      res.status(statusCode).json({
        success: false,
        message: "Failed to create comprador",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // POST /api/users/vendedores - Create Vendedor specifically
  async createVendedor(req: Request, res: Response): Promise<void> {
    try {
      const { nome, email, senha, celular, endereco, nota } = req.body;

      // Basic validation
      if (!nome || !email || !senha) {
        res.status(400).json({
          success: false,
          message: "Nome, email, and senha are required",
        });
        return;
      }

      const userData: CreateVendedorDto = {
        nome,
        email,
        senha,
        celular,
        endereco,
        nota,
      };

      const vendedor = await this.userService.createVendedor(userData);

      res.status(201).json({
        success: true,
        message: "Vendedor created successfully",
        data: vendedor,
      });
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message === "Email already exists"
          ? 409
          : 500;
      res.status(statusCode).json({
        success: false,
        message: "Failed to create vendedor",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // PUT /api/users/:id - Update user (polymorphic)
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid user ID format (UUID expected)",
        });
        return;
      }

      const { type, data } = req.body;

      // Validate type
      if (!type || (type !== USER_TYPE.COMPRADOR && type !== USER_TYPE.VENDEDOR)) {
        res.status(400).json({
          success: false,
          message:
            'Type is required and must be either "Comprador" or "Vendedor"',
        });
        return;
      }

      if (!data) {
        res.status(400).json({
          success: false,
          message: "Data is required",
        });
        return;
      }

      const userData: UpdateUserDto = { type, data };
      const user = await this.userService.updateUser(id, userData);

      res.json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      let statusCode = 500;
      if (error instanceof Error) {
        if (error.message === "User not found") statusCode = 404;
        if (error.message === "Email already exists") statusCode = 409;
        if (error.message.includes("is not a")) statusCode = 400;
      }

      res.status(statusCode).json({
        success: false,
        message: "Failed to update user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // DELETE /api/users/:id
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        res.status(400).json({
          success: false,
          message: "Invalid user ID format (UUID expected)",
        });
        return;
      }

      const deleted = await this.userService.deleteUser(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      let statusCode = 500;
      if (error instanceof Error) {
        if (error.message === "User not found") statusCode = 404;
        if (error.message.includes("Cannot delete")) statusCode = 400;
      }

      res.status(statusCode).json({
        success: false,
        message: "Failed to delete user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
