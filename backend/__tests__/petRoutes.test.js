const request = require('supertest');
const express = require('express');
const petRoutes = require('../routes/petRoutes');
const mongoose = require('mongoose');


jest.mock('../models/Pet', () => {
  const mockPet = function (data) {
    Object.assign(this, data);
  };
  mockPet.prototype.save = jest.fn();
  mockPet.find = jest.fn();
  mockPet.findById = jest.fn();
  mockPet.findByIdAndUpdate = jest.fn();
  mockPet.findByIdAndDelete = jest.fn();
  return mockPet;
});

const app = express();
app.use(express.json());
app.use('/pets', petRoutes);

describe('Pet Routes', () => {
  afterAll(() => {
    mongoose.connection.close();
  });

  test('GET /pets - should fetch all pets', async () => {
    const mockPets = [{ name: 'Buddy', breed: 'Golden Retriever', age: 3 }];
    require('../models/Pet').find.mockResolvedValue(mockPets);

    const response = await request(app).get('/pets');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPets);
  });

  test('GET /pets/:id - should fetch a pet by ID', async () => {
    const mockPet = { name: 'Buddy', breed: 'Golden Retriever', age: 3 };
    require('../models/Pet').findById.mockResolvedValue(mockPet);

    const response = await request(app).get('/pets/123');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPet);
  });

  test('POST /pets/post - should create a new pet', async () => {
    const newPet = { name: 'Buddy', breed: 'Golden Retriever', age: 3, userId: '123' };
    const savedPet = { ...newPet, _id: '456' };
    require('../models/Pet').prototype.save.mockResolvedValue(savedPet);

    const response = await request(app).post('/pets/post').send(newPet);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(savedPet);
  });

  test('PUT /pets/:id - should update a pet', async () => {
    const updatedPet = { name: 'Buddy', breed: 'Golden Retriever', age: 4, userId: '123' };
    require('../models/Pet').findByIdAndUpdate.mockResolvedValue(updatedPet);

    const response = await request(app).put('/pets/123').send(updatedPet);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedPet);
  });

  test('DELETE /pets/:id - should delete a pet', async () => {
    const deletedPet = { name: 'Buddy', breed: 'Golden Retriever', age: 3 };
    require('../models/Pet').findByIdAndDelete.mockResolvedValue(deletedPet);

    const response = await request(app).delete('/pets/123');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Pet deleted successfully');
  });
});