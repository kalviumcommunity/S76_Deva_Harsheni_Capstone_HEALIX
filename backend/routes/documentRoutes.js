// routes/documentRoutes.js
const express = require('express');
const router = express.Router();
const Document = require('../models/Document');

// GET all documents
router.get('/', async (req, res) => {
  try {
    const documents = await Document.find().populate('petId', 'name breed');
    res.json(documents);
  } catch (err) {
    console.error('Error fetching documents:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET documents for a specific pet
router.get('/pet/:petId', async (req, res) => {
  try {
    const documents = await Document.find({ petId: req.params.petId }).populate('petId', 'name breed');
    res.json(documents);
  } catch (err) {
    console.error('Error fetching documents for pet:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET documents by type
router.get('/type/:type', async (req, res) => {
  try {
    const validTypes = ['prescription', 'vet_report', 'other'];
    if (!validTypes.includes(req.params.type)) {
      return res.status(400).json({ message: 'Invalid document type' });
    }
    
    const documents = await Document.find({ documentType: req.params.type }).populate('petId', 'name breed');
    res.json(documents);
  } catch (err) {
    console.error('Error fetching documents by type:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//DID THE POST NOW ITSELF TO CHECK WHETHER THE GET WORKS OR NOT !


// POST - Upload a new document
router.post('/', async (req, res) => {
  try {
    const { petId, title, fileUrl, documentType } = req.body;
    
    // Validate required fields
    if (!petId || !title || !fileUrl) {
      return res.status(400).json({ message: 'petId, title, and fileUrl are required fields' });
    }
    
    // Validate document type if provided
    if (documentType) {
      const validTypes = ['prescription', 'vet_report', 'other'];
      if (!validTypes.includes(documentType)) {
        return res.status(400).json({ message: 'Invalid document type' });
      }
    }
    
    const newDocument = new Document({
      petId,
      title,
      fileUrl,
      documentType
    });
    
    const savedDocument = await newDocument.save();
    res.status(201).json(savedDocument);
  } catch (err) {
    console.error('Error creating document:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;