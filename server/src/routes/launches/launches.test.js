const request = require('supertest');
const app = require('../../app');
 
describe('Test GET/launches', () => {
    test('Debe retornar 200', async () => {
        const response = await request(app).get('/launches')
                                    .expect('Content-Type',/json/)
                                    .expect(200);
    })
})
 
 
describe('Test POST/launches', () => {
 
    describe('Test POST /launch', () => {
        
        const completeLaunchData = {
          mission: 'USS Enterprise',
          rocket: 'NCC 1701-D',
          target: 'Kepler-62 f',
          launchDate: 'January 4, 2028',
        };
     
        const launchDataWithoutDate = {
          mission: 'USS Enterprise',
          rocket: 'NCC 1701-D',
          target: 'Kepler-62 f',
        };
 
 
        test('It should respond with 201 created', async () => {
            const response = await request(app)
                .post('/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
  
            // testeamos la fecha por separado; aquí no usamos supertest sino jest
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
            expect(response.body).toMatchObject(launchDataWithoutDate);
        })
    
    })
})

