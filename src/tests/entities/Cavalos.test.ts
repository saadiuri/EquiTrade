import { Cavalo } from '../../db/entities/Cavalos';
import { User } from '../../db/entities/User';
import { Comprador } from '../../db/entities/Comprador';

// Criamos uma classe concreta para poder testar a abstrata
class CavaloConcreto extends Cavalo {
    async marcarComoVendido(): Promise<void> {
        this.disponivel = false;
    }

    async reativarAnuncio(): Promise<void> {
        this.disponivel = true;
    }
}

describe('Entidade Cavalo', () => {
    let cavalo: CavaloConcreto;

    beforeEach(() => {
        const user = new Comprador();
;
        user.id = '123';
        user.nome = 'João';

        cavalo = new CavaloConcreto();
        cavalo.nome = 'Tornado';
        cavalo.idade = 5;
        cavalo.raca = 'Mangalarga';
        cavalo.preco = 25000.0;
        cavalo.descricao = 'Cavalo muito dócil e rápido';
        cavalo.dono = user;
        cavalo.disponivel = true; // 👈 Adicione esta linha
    });


    test('deve criar um cavalo com os atributos corretos', () => {
        expect(cavalo.nome).toBe('Tornado');
        expect(cavalo.idade).toBe(5);
        expect(cavalo.raca).toBe('Mangalarga');
        expect(cavalo.preco).toBe(25000.0);
        expect(cavalo.descricao).toBeDefined();
        expect(cavalo.disponivel).toBe(true);
    });

    test('deve marcar o cavalo como vendido', async () => {
        await cavalo.marcarComoVendido();
        expect(cavalo.disponivel).toBe(false);
    });

    test('deve reativar o anúncio do cavalo', async () => {
        await cavalo.marcarComoVendido(); // primeiro vende
        await cavalo.reativarAnuncio(); // depois reativa
        expect(cavalo.disponivel).toBe(true);
    });

    test('deve ter um dono associado', () => {
        expect(cavalo.dono).toBeDefined();
        expect(cavalo.dono.nome).toBe('João');
    });
});
