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
      CavaloDto: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'UUID único do cavalo',
          },
          nome: {
            type: 'string',
            description: 'Nome do cavalo',
          },
          idade: {
            type: 'integer',
            minimum: 1,
            maximum: 50,
            description: 'Idade do cavalo em anos',
          },
          raca: {
            type: 'string',
            description: 'Raça do cavalo',
          },
          preco: {
            type: 'number',
            format: 'decimal',
            minimum: 0,
            description: 'Preço do cavalo',
          },
          descricao: {
            type: 'string',
            description: 'Descrição detalhada do cavalo',
          },
          disponivel: {
            type: 'boolean',
            description: 'Indica se o cavalo está disponível para venda',
          },
          premios: {
            type: 'string',
            description: 'Prêmios e conquistas do cavalo',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criação do anúncio',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de última atualização',
          },
          dono: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'UUID do proprietário',
              },
              nome: {
                type: 'string',
                description: 'Nome do proprietário',
              },
              email: {
                type: 'string',
                format: 'email',
                description: 'Email do proprietário',
              },
            },
            required: ['id', 'nome', 'email'],
            description: 'Informações do proprietário do cavalo',
          },
        },
        required: ['id', 'nome', 'idade', 'raca', 'preco', 'disponivel', 'createdAt', 'updatedAt', 'dono'],
      },
      CreateCavaloDto: {
        type: 'object',
        properties: {
          nome: {
            type: 'string',
            description: 'Nome do cavalo',
          },
          idade: {
            type: 'integer',
            minimum: 1,
            maximum: 50,
            description: 'Idade do cavalo em anos',
          },
          raca: {
            type: 'string',
            description: 'Raça do cavalo',
          },
          preco: {
            type: 'number',
            format: 'decimal',
            minimum: 0,
            description: 'Preço do cavalo',
          },
          descricao: {
            type: 'string',
            description: 'Descrição detalhada do cavalo',
          },
          disponivel: {
            type: 'boolean',
            default: true,
            description: 'Indica se o cavalo está disponível para venda',
          },
          premios: {
            type: 'string',
            description: 'Prêmios e conquistas do cavalo',
          },
          donoId: {
            type: 'string',
            format: 'uuid',
            description: 'UUID do proprietário do cavalo',
          },
        },
        required: ['nome', 'idade', 'raca', 'preco', 'donoId'],
      },
      UpdateCavaloDto: {
        type: 'object',
        properties: {
          nome: {
            type: 'string',
            description: 'Nome do cavalo',
          },
          idade: {
            type: 'integer',
            minimum: 1,
            maximum: 50,
            description: 'Idade do cavalo em anos',
          },
          raca: {
            type: 'string',
            description: 'Raça do cavalo',
          },
          preco: {
            type: 'number',
            format: 'decimal',
            minimum: 0,
            description: 'Preço do cavalo',
          },
          descricao: {
            type: 'string',
            description: 'Descrição detalhada do cavalo',
          },
          disponivel: {
            type: 'boolean',
            description: 'Indica se o cavalo está disponível para venda',
          },
          premios: {
            type: 'string',
            description: 'Prêmios e conquistas do cavalo',
          },
        },
        description: 'Todos os campos são opcionais para atualização',
      },
      CavaloStatsDto: {
        type: 'object',
        properties: {
          total: {
            type: 'integer',
            description: 'Total de cavalos cadastrados',
          },
          available: {
            type: 'integer',
            description: 'Número de cavalos disponíveis',
          },
          unavailable: {
            type: 'integer',
            description: 'Número de cavalos indisponíveis',
          },
          averagePrice: {
            type: 'number',
            format: 'float',
            description: 'Preço médio dos cavalos',
          },
          averageAge: {
            type: 'number',
            format: 'float',
            description: 'Idade média dos cavalos',
          },
        },
        required: ['total', 'available', 'unavailable', 'averagePrice', 'averageAge'],
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
