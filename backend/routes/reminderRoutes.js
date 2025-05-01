// routes/reminderRoutes.js
const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

// GET all reminders
router.get('/', async (req, res) => {
  try {
    const reminders = await Reminder.find().populate('petId', 'name breed');
    res.json(reminders);
  } catch (err) {
    console.error('Error fetching reminders:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET reminders for a specific pet
router.get('/pet/:petId', async (req, res) => {
  try {
    const reminders = await Reminder.find({ petId: req.params.petId }).populate('petId', 'name breed');
    res.json(reminders);
  } catch (err) {
    console.error('Error fetching reminders for pet:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET reminders by type (vaccination, vet_visit, medication, walk, feeding)
router.get('/type/:type', async (req, res) => {
  try {
    const validTypes = ['vaccination', 'vet_visit', 'medication', 'walk', 'feeding'];
    if (!validTypes.includes(req.params.type)) {
      return res.status(400).json({ message: 'Invalid reminder type' });
    }
    
    const reminders = await Reminder.find({ type: req.params.type }).populate('petId', 'name breed');
    res.json(reminders);
  } catch (err) {
    console.error('Error fetching reminders by type:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



//DID THE POST NOW ITSELF TO CHECK WHETHER THE GET WORKS OR NOT !


// POST - Create a new reminder
router.post('/', async (req, res) => {
  try {
    const { petId, type, title, date, time, notes } = req.body;
    
    // Validate required fields
    if (!petId || !type || !title || !date) {
      return res.status(400).json({ message: 'petId, type, title, and date are required fields' });
    }
    
    // Validate type is in allowed values
    const validTypes = ['vaccination', 'vet_visit', 'medication', 'walk', 'feeding'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid reminder type' });
    }
    
    const newReminder = new Reminder({
      petId,
      type,
      title,
      date,
      time,
      notes
    });
    
    const savedReminder = await newReminder.save();
    res.status(201).json(savedReminder);
  } catch (err) {
    console.error('Error creating reminder:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;