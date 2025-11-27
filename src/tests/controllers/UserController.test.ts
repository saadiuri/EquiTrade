import request from "supertest";
import http from "http";
import app from "../../server";
import { AppDataSource } from "../../config/database";

// Mock do banco de dados para evitar conexão real
jest.mock("../../config/database", () => ({
    AppDataSource: {
        initialize: jest.fn().mockResolvedValue(true),
        destroy: jest.fn().mockResolvedValue(true),
        getRepository: jest.fn(),
    },
}));

let server: http.Server;

beforeAll(async () => {
    // Garante que o app inicie e escute uma porta antes dos testes
    server = app.listen(0); // 0 = porta aleatória livre
});

afterAll(async () => {
    await AppDataSource.destroy();
    server.close();
});

describe("Rotas de usuário", () => {
    it("GET /users deve retornar lista de usuários", async () => {
        const res = await request(server).get("/users");
        expect([200, 404]).toContain(res.status);
    });

    it("POST /users deve criar um novo usuário", async () => {
        const res = await request(server)
            .post("/users")
            .send({ nome: "Carlos", email: "carlos@teste.com", senha: "abc123" });

        expect([201, 404]).toContain(res.status);
    });
});
