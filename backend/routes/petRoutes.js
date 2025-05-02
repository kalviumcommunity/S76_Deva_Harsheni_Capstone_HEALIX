// routes/petRoutes.js
const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');

// GET all pets (for a specific user in the future)
router.get('/', async (req, res) => {
  try {
    // In the future, you'll filter by userId when auth is implemented
    const pets = await Pet.find();
    res.json(pets);
  } catch (err) {
    console.error('Error fetching pets:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET a specific pet by ID
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json(pet);
  } catch (err) {
    console.error('Error fetching pet:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


//DID THE POST NOW ITSELF TO CHECK WHETHER THE GET WORKS OR NOT !

// POST - Add a new pet
router.post('/post', async (req, res) => {
  try {
    const { name, breed, age, userId, medicalHistory } = req.body;
    
    // Basic validation
    if (!name || !breed || !age || !userId) {
      return res.status(400).json({ message: 'Please provide name, breed, age, and userId' });
    }
    
    const newPet = new Pet({
      name,
      breed,
      age,
      userId,
      medicalHistory
    });
    
    const savedPet = await newPet.save();
    res.status(201).json(savedPet);
  } catch (err) {
    console.error('Error creating pet:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;