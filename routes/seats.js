const express = require('express');
const { Seat, Booking } = require('../db');
const auth = require('../middlewares/auth');
const router = express.Router();

router.get('/seats', async (req, res) => {
  try {
    const seats = await Seat.findAll({
      order: [['seat_id', 'ASC']]
    });

    res.json(seats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching seats' });
  }
});

router.post('/reserve', auth, async (req, res) => {
  const { number, seats } = req.body;
  try {

    if (seats.length === 0) {
      const availableSeats = await Seat.findAll({
        where: { is_reserved: false },
        order: [['row_number', 'ASC'], ['seat_id', 'ASC']],
      });

      if (availableSeats.length < number) {
        return res.status(400).json({ message: 'Not enough seats available' });
      }

      const rows = {};
      availableSeats.forEach((seat) => {
        if (!rows[seat.row_number]) rows[seat.row_number] = [];
        rows[seat.row_number].push(seat);
      });

      let seatsToReserve = [];

      for (const row in rows) {
        const rowSeats = rows[row];
        for (let i = 0; i < rowSeats.length - number + 1; i++) {
          const potentialSeats = rowSeats.slice(i, i + number);
          if (potentialSeats.every((seat, index) => seat.seat_id === potentialSeats[0].seat_id + index)) {
            seatsToReserve = potentialSeats;
            break;
          }
        }
        if (seatsToReserve.length > 0) break;
      }

      if (seatsToReserve.length === 0) {
        seatsToReserve = availableSeats.slice(0, number);
      }

      const seatIds = seatsToReserve.map((seat) => seat.seat_id);

      await Seat.update({ is_reserved: true, user_id: req.user.user_id }, { where: { seat_id: seatIds } });

      await Booking.create({
        user_id: req.user.user_id,
        seats_booked: seatIds,
        booking_time: new Date(),
      })
    }
    else {
      let seatIds = seats.map((seat) => seat.seat_id)

      await Seat.update({ is_reserved: true, user_id: req.user.user_id }, { where: { seat_id: seatIds } });

      await Booking.create({
        user_id: req.user.user_id,
        seats_booked: seatIds,
        booking_time: new Date(),
      });
    }

    res.json({ message: 'Seats reserved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error reserving seats' });
  }
});

router.get('/bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.findAll({ user_id: req.user.user_id })
    res.json({ message: 'Seats reserved successfully', bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error reserving seats' });
  }
});


module.exports = router;
