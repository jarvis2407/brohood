const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const upload = require('../middleware/upload');

// Get all rooms or filter by location
router.get('/', async (req, res) => {
  const location = req.query.location;
  let rooms;
  if (location) {
    rooms = await Room.find({ location: { $regex: location, $options: 'i' } });
  } else {
    rooms = await Room.find();
  }
  res.json(rooms);
});

// Post a new room with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const roomData = req.body;
    if (req.file) {
      roomData.image = `/uploads/${req.file.filename}`;
    }
    const room = new Room(roomData);
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
