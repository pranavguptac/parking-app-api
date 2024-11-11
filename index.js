const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

const parkingSpots = [
  { id: 1, location: 'A1' },
  { id: 2, location: 'A2' },
  { id: 3, location: 'B1' },
  { id: 4, location: 'B2' },
];

const bookings = [];

// GET /api/parking-spots - Get all parking spots
app.get('/api/parking-spots', (req, res) => {
  res.json(parkingSpots);
});

// GET /api/booked-spots - Get booked spots for a specific date
app.get('/api/booked-spots', (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: 'Date is required' });

  const bookedSpots = bookings.filter(booking => booking.date === date);
  res.json(bookedSpots);
});

// POST /api/bookings - Add a booking for a specific spot and date
app.post('/api/bookings', (req, res) => {
  const { spotId, date } = req.body;
  if (!spotId || !date) {
    return res.status(400).json({ message: 'spotId and date are required' });
  }

  const spotExists = parkingSpots.some(spot => spot.id === spotId);
  if (!spotExists) {
    return res.status(404).json({ message: 'Parking spot not found' });
  }

  const isBooked = bookings.some(booking => booking.spotId === spotId && booking.date === date);
  if (isBooked) {
    return res.status(409).json({ message: 'Spot already booked for this date' });
  }

  bookings.push({ spotId, date });
  res.status(201).json({ message: 'Booking added' });
});

// DELETE /api/bookings - Remove a booking
app.delete('/api/bookings', (req, res) => {
  const { spotId, date } = req.body;
  const index = bookings.findIndex(booking => booking.spotId === spotId && booking.date === date);

  if (index === -1) return res.status(404).json({ message: 'Booking not found' });

  bookings.splice(index, 1);
  res.status(200).json({ message: 'Booking removed' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
