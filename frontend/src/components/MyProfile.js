import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../store/AuthContext';

const MyProfile = () => {
  const authCtx = useContext(AuthContext)
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/bookings',{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authCtx.token}`,
      },
    })
      .then(response => {
        setBookings(response.data.bookings);
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  console.log(bookings)
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border rounded-lg shadow-md my-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>

        <div>
          <p className="text-lg mb-2"><strong>Name:</strong> {authCtx?.user?.name}</p>
          <p className="text-lg mb-4"><strong>Email:</strong> {authCtx?.user?.email}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No Bookings Yet .</p>
        ) : (
          <div>
            {bookings.map((booking, index) => (
              <div
                key={index}
                className="border-b py-4 mb-4"
              >
                <p><strong>Booking Date:</strong> {new Date(booking?.booking_time).toLocaleDateString()}</p>
                <p><strong>Total Seats:</strong> {booking?.seats_booked?.length}</p>
                <p><strong>Seats:</strong> {booking?.seats_booked?.join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
