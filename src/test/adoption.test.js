import chai from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
import app from '../app.js';
import { expect } from 'chai';

chai.use(chaiHttp);

const request = supertest(app);

describe('Adoption Router', () => {
    let userId;
    let petId;
    let adoptionId;

    // usuario y mascota de prueba
    before(async () => {
        const userRes = await request.post('/api/users').send({
            first_name: 'Test',
            last_name: 'User',
            email: 'hola@gmail.com',
            password: 'password123',
        });

        console.log('User Response:', userRes.body);
        userId = userRes.body?.payload?._id;
        if (!userId) throw new Error('Error: No se pudo obtener el userId');

        const petRes = await request.post('/api/pets').send({
            name: 'Firulais',
            specie: 'Dog',
            owner: userId,
            birthDate: '2022-01-01',
            adopted: false,
        });

        console.log('Pet Response:', petRes.body);
        petId = petRes.body?.payload?._id;
        if (!petId) throw new Error('Error: No se pudo obtener el petId');
    });

    it('Debe obtener todas las adopciones', async () => {
        const res = await request.get('/api/adoptions/');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('payload').that.is.an('array');
    });

    it('Debe crear una adopción', async () => {
        const res = await request.post(`/api/adoptions/${userId}/${petId}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('message', 'Pet adopted');

        adoptionId = res.body.payload?._id;
    });

    it('Debe obtener una adopción por ID', async () => {
        console.log('ADOPTIONID: ', adoptionId);
        console.log(typeof adoptionId);
        const res = await request.get(`/api/adoptions/${adoptionId}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('payload');
        expect(res.body.payload).to.have.property('_id', adoptionId);
    });

    it('Debe devolver un error si la adopción no existe', async () => {
        const res = await request.get('/api/adoptions/653f1f2b5f1e5a001c1b4e76');
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('error', 'Adoption not found');
    });
});
