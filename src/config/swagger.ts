import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'EquiTrade API',
    version: '1.0.0',
    description: 'API para plataforma de comércio de cavalos - EquiTrade',
    contact: {
      name: 'EquiTrade Team',
      email: 'dev@equitrade.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    schemas: {
      CompradorDto: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'UUID único do comprador',
          },
          nome: {
            type: 'string',
            description: 'Nome completo do comprador',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Email do comprador',
          },
          celular: {
            type: 'string',
            description: 'Número de celular',
          },
          endereco: {
            type: 'string',
            description: 'Endereço do comprador',
          },
          type: {
            type: 'string',
            enum: ['Comprador'],
            description: 'Tipo de usuário',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criação',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de última atualização',
          },
        },
        required: ['id', 'nome', 'email', 'type', 'createdAt', 'updatedAt'],
      },
      VendedorDto: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'UUID único do vendedor',
          },
          nome: {
            type: 'string',
            description: 'Nome completo do vendedor',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Email do vendedor',
          },
          celular: {
            type: 'string',
            description: 'Número de celular',
          },
          endereco: {
            type: 'string',
            description: 'Endereço do vendedor',
          },
          type: {
            type: 'string',
            enum: ['Vendedor'],
            description: 'Tipo de usuário',
          },
          nota: {
            type: 'number',
            format: 'float',
            minimum: 0,
            maximum: 5,
            description: 'Avaliação do vendedor (0-5)',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criação',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de última atualização',
          },
        },
        required: ['id', 'nome', 'email', 'type', 'nota', 'createdAt', 'updatedAt'],
      },
      CreateCompradorDto: {
        type: 'object',
        properties: {
          nome: {
            type: 'string',
            description: 'Nome completo do comprador',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Email do comprador',
          },
          senha: {
            type: 'string',
            minLength: 6,
            description: 'Senha do comprador',
          },
          celular: {
            type: 'string',
            description: 'Número de celular',
          },
          endereco: {
            type: 'string',
            description: 'Endereço do comprador',
          },
        },
        required: ['nome', 'email', 'senha'],
      },
      CreateVendedorDto: {
        type: 'object',
        properties: {
          nome: {
            type: 'string',
            description: 'Nome completo do vendedor',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Email do vendedor',
          },
          senha: {
            type: 'string',
            minLength: 6,
            description: 'Senha do vendedor',
          },
          celular: {
            type: 'string',
            description: 'Número de celular',
          },
          endereco: {
            type: 'string',
            description: 'Endereço do vendedor',
          },
          nota: {
            type: 'number',
            format: 'float',
            minimum: 0,
            maximum: 5,
            description: 'Avaliação inicial do vendedor (opcional)',
          },
        },
        required: ['nome', 'email', 'senha'],
      },
      UserStatsDto: {
        type: 'object',
        properties: {
          total: {
            type: 'integer',
            description: 'Total de usuários cadastrados',
          },
          compradores: {
            type: 'integer',
            description: 'Número de compradores',
          },
          vendedores: {
            type: 'integer',
            description: 'Número de vendedores',
          },
          averageVendedorRating: {
            type: 'number',
            format: 'float',
            description: 'Avaliação média dos vendedores',
          },
        },
        required: ['total', 'compradores', 'vendedores', 'averageVendedorRating'],
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Indica se a operação foi bem-sucedida',
          },
          message: {
            type: 'string',
            description: 'Mensagem descritiva da operação',
          },
          data: {
            description: 'Dados retornados pela operação',
          },
          error: {
            type: 'string',
            description: 'Mensagem de erro (apenas em caso de falha)',
          },
        },
        required: ['success'],
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Paths para arquivos com anotações JSDoc
};

export const swaggerSpec = swaggerJsdoc(options);
