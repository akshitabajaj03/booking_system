import React, { useContext, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import AuthContext from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookingForm = ({ selectedSeats, updateSeatsToBaseState, setSelectedSeats }) => {
  const authCtx = useContext(AuthContext)
  const navigate=useNavigate()
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!number) {
      if (selectedSeats.length < 1 || selectedSeats.length > 7) {
        setError('Please select atleast 1 seat and at max 7 seats');
        return;
      }
    }

    const bookingData = {
      number,
      seats: selectedSeats,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/reserve', bookingData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authCtx.token}`,
        },
      });
      if (response.status === 200) {
        toast.success('Booking successful!');
        navigate('/profile')
        setError('')
      }
    } catch (error) {
      console.error('Error booking seats:', error);
      toast.error(error?.response?.data?.message)
      setError('')
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 rounded-lg bg-white">
      <Toaster />
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-4">Book Your Tickets</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-4">
          <label htmlFor="number" className="block text-lg font-semibold">Number of Seats:</label>
          <input
            type="number"
            id="number"
            min={1}
            max={7}
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full p-2 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">Selected Seats:</label>
          <ul className="list-disc pl-5">
            {selectedSeats.length === 0 ? (
              <li>Select Seats To Book</li>
            ) : (
              selectedSeats.map((seat, index) => (
                <li key={index}>Seat Number: {seat.seat_id}</li>
              ))
            )}
          </ul>
        </div>

        <div className="flex justify-between gap-3">
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-md focus:outline-none"
            onClick={() => {
              setNumber('')
              setSelectedSeats([])
              updateSeatsToBaseState()
              setError('')
            }}
          >
            Cancel Selection
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Book Seats
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
