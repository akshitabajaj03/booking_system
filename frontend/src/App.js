import React, { useContext, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthContext from './store/AuthContext';
import SeatGrid from './components/SeatGrid';
import BookingForm from './components/BookingForm';
import Navbar from './components/NavBar';
import Login from './components/Login';
import MyProfile from './components/MyProfile';

const App = () => {
  const authCtx = useContext(AuthContext);
  const [seats, setSeats] = useState(
    new Array(80).fill(false).map((_, index) => ({
      seat_id: `${index + 1}`,
      isBooked: false,
      isSelected: false,
    }))
  );
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [baseSeatState, setBaseSeatState] = useState([])

  const updateSeatsToBaseState = () => {
    setTotalAmount(0)
    setTotalCount(0)
    setSeats(baseSeatState)
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          index
          element={authCtx.isLoggedIn ? (
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-col md:flex-row w-full max-w-screen-lg p-4 space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex-1 bg-white shadow-md rounded-lg p-4">
                  <div className="mb-4">
                    <div className="flex space-x-4 mb-4 justify-center">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-white-500 rounded-full mr-2 border-gray-500 border-2"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-500 rounded-full mr-2"></div>
                        <span>Booked</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                        <span>Selected</span>
                      </div>
                    </div>
                    <div className="w-full">
                      <SeatGrid setTotalAmount={setTotalAmount} setSelectedSeats={setSelectedSeats} setTotalCount={setTotalCount} selectedSeats={selectedSeats} setBaseSeatState={setBaseSeatState} setSeats={setSeats} seats={seats} />
                      <div className="text-lg font-semibold mt-2">Price Details</div>
                      <div className="flex justify-between">
                        <span>Total <span className="font-bold">{totalCount}</span> Seats Selected</span>
                        <span>₹<span className="font-bold text-xl">{totalAmount}</span></span>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                  <BookingForm selectedSeats={selectedSeats} updateSeatsToBaseState={updateSeatsToBaseState} setSelectedSeats={setSelectedSeats} />
                </div>
              </div>
            </div>
          ) : <Navigate to="/signin" />}
        />
        <Route path='/profile' element={authCtx.isLoggedIn ? <MyProfile /> : <Navigate to="/signin" />} />
        <Route path="/signin" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;
