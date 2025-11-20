import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../db/repositories/UserRepository';
import { LoginDto, RegisterDto, AuthResponseDto } from '../dto/auth.dto';
import { Comprador } from '../db/entities/Comprador';
import { Vendedor } from '../db/entities/Vendedor';
import { User } from '../db/entities/User';
import { StringValue } from 'ms';

export class AuthService {
  private userRepository: UserRepository;
  private jwtSecret: string;
  private jwtExpiresIn: string;

  constructor() {
    this.userRepository = new UserRepository();
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7D';
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(userId: string, email: string, tipo: string): string {
    return jwt.sign(
      { userId, email, tipo },
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn  as StringValue}
    );
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }

  async login(loginData: LoginDto): Promise<AuthResponseDto> {
    const { email, senha } = loginData;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Email ou senha inválidos');
    }

    // const isPasswordValid = await this.comparePassword(senha, user.senha);
    const isPasswordValid = senha === user.senha; /*PARA TESTAR O LOGIN SEM HASH LOCALMENTE*/

    if (!isPasswordValid) {
      throw new Error('Email ou senha inválidos');
    }

    const tipo = user instanceof Comprador ? 'Comprador' : 'Vendedor';
    const token = this.generateToken(user.id, user.email, tipo);

    return {
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo,
      },
    };
  }

  async register(registerData: RegisterDto): Promise<AuthResponseDto> {
    const { email, senha, tipo, ...userData } = registerData;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    const hashedPassword = await this.hashPassword(senha);

    let user: User;
    if (tipo === 'Comprador') {
      user = await this.userRepository.createComprador({
        ...userData,
        email,
        senha: hashedPassword,
      });
    } else {
      user = await this.userRepository.createVendedor({
        ...userData,
        email,
        senha: hashedPassword,
        nota: registerData.nota || 0,
      });
    }

    const token = this.generateToken(user.id, user.email, tipo);

    return {
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo,
      },
    };
  }
}

