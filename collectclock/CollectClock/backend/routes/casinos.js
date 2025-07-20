const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming a database module is available

// Get all casinos
router.get('/api/casinos', async (req, res) => {
  try {
    const casinos = await db.getCasinos(); // Fetch casino data from the database
    res.json(casinos);
  } catch (error) {
    console.error('Error fetching casinos:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Collect bonus for a specific casino
router.post('/api/collect/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCasino = await db.collectBonus(id); // Update collection status in the database
    res.json(updatedCasino);
  } catch (error) {
    console.error('Error collecting bonus:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
