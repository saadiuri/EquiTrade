import { User } from '../../db/entities/User';
import { Mensagem } from '../../db/entities/Mensagem';

// Classe concreta apenas para teste
class UserConcreto extends User {
    async signUp(): Promise<void> {
        this.createdAt = new Date();
    }

    async login(email: string, senha: string): Promise<boolean> {
        return this.email === email && this.senha === senha;
    }

    async logout(): Promise<void> {
        // Poderia limpar algum token, simulação apenas
    }

    async editarPerfil(dados: Partial<User>): Promise<void> {
        Object.assign(this, dados);
    }

    async enviarMensagem(destinatarioId: string, conteudo: string): Promise<Mensagem> {
        const mensagem = new Mensagem();
        mensagem.conteudo = conteudo;
        mensagem.remetente = this;
        mensagem.destinatario = new UserConcreto();
        mensagem.destinatario.id = destinatarioId;
        mensagem.createdAt = new Date();
        return mensagem;
    }
}

describe('Entidade User', () => {
    let user: UserConcreto;

    beforeEach(() => {
        user = new UserConcreto();
        user.id = 'abc123';
        user.nome = 'Ana';
        user.email = 'ana@example.com';
        user.senha = 'senha123';
        user.celular = '11999999999';
        user.endereco = 'Rua das Flores, 123';
    });

    test('deve criar um usuário com os atributos corretos', () => {
        expect(user.nome).toBe('Ana');
        expect(user.email).toBe('ana@example.com');
        expect(user.senha).toBe('senha123');
        expect(user.celular).toBe('11999999999');
        expect(user.endereco).toContain('Flores');
    });

    test('deve permitir login com credenciais corretas', async () => {
        const resultado = await user.login('ana@example.com', 'senha123');
        expect(resultado).toBe(true);
    });

    test('deve falhar login com credenciais incorretas', async () => {
        const resultado = await user.login('ana@example.com', 'errada');
        expect(resultado).toBe(false);
    });

    test('deve editar o perfil corretamente', async () => {
        await user.editarPerfil({ nome: 'Ana Paula', celular: '11888888888' });
        expect(user.nome).toBe('Ana Paula');
        expect(user.celular).toBe('11888888888');
    });

    test('deve enviar uma mensagem para outro usuário', async () => {
        const msg = await user.enviarMensagem('xyz789', 'Olá, tudo bem?');
        expect(msg.conteudo).toBe('Olá, tudo bem?');
        expect(msg.remetente).toBe(user);
        expect(msg.destinatario.id).toBe('xyz789');
        expect(msg.createdAt).toBeInstanceOf(Date);
    });
});
