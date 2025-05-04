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

// PUT - Update a reminder
router.put('/:id', async (req, res) => {
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
    
    const updatedReminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      {
        petId,
        type,
        title,
        date,
        time,
        notes
      },
      { new: true } // Return the updated document
    );
    
    if (!updatedReminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    
    res.json(updatedReminder);
  } catch (err) {
    console.error('Error updating reminder:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE - Remove a reminder
router.delete('/:id', async (req, res) => {
  try {
    const deletedReminder = await Reminder.findByIdAndDelete(req.params.id);
    
    if (!deletedReminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    
    res.json({ message: 'Reminder deleted successfully', deletedReminder });
  } catch (err) {
    console.error('Error deleting reminder:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;