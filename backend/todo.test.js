import request from 'supertest';
import { app, server, db } from './index';
import getKeycloakToken from './utils';

let token; // Speichert den abgerufenen JWT-Token

beforeAll(async () => {
  token = await getKeycloakToken();
});

describe('GET /todos (unautorisiert)', () => {
  it('sollte einen 401-Fehler zurückgeben, wenn kein Token bereitgestellt wird', async () => {
    const response = await request(app).get('/todos'); // Kein Authorization-Header

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  });
});

// Beispiel für einen geschützten Test:
describe('GET /todos', () => {
  it('sollte alle Todos abrufen', async () => {
    const response = await request(app)
      .get('/todos')
      .set('Authorization', `Bearer ${token}`); // Fügen Sie den Authorization-Header hinzu

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});

const request = require('supertest');
const app = require('../app'); 

describe('POST /todos', () => {
    it('sollte ein neues Todo erstellen', async () => {
        const newTodo = {
            "title": "Übung 4 machen",
            "due": "2022-11-12T00:00:00.000Z",
            "status": 0
        };

        const response = await request(app)
           .post('/todos')
           .set('Authorization', `Bearer ${token}`)
           .send(newTodo);
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(newTodo.title);
        expect(response.body.due).toBe(newTodo.due);
    });
});






afterAll(async () => {
    server.close()
    db.close()
})