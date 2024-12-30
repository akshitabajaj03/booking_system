import React, { useEffect } from 'react';
import Seat from './Seat';
import axios from 'axios';

const SeatGrid = ({ seats, setSeats, setTotalAmount, setTotalCount, setSelectedSeats, selectedSeats, setBaseSeatState }) => {
    const handleSeatChange = (id) => {
        let found = false;
        for (let i = 0; i < selectedSeats.length; i++)
            if (selectedSeats[i].seat_id === id)
                found = true;

        if (found === false && selectedSeats.length === 7) {
            alert('You can select only 7 seats at once.')
            return;
        }

        setSeats((prevSeats) => {
            const updatedSeats = prevSeats.map((seat) => {
                if (seat.seat_id === id) {
                    return { ...seat, isSelected: !seat.isSelected };
                }
                return seat;
            });
            updateTotals(updatedSeats);
            return updatedSeats;
        });
    };

    const updateTotals = (updatedSeats) => {
        let newTotalAmount = 0;
        let newTotalCount = 0;
        let selectedSeats = [];

        updatedSeats.forEach((seat) => {
            if (seat.isSelected) {
                newTotalAmount += 200;
                newTotalCount += 1;
                selectedSeats.push(seat);
            }
        });

        setSelectedSeats(selectedSeats);
        setTotalAmount(newTotalAmount);
        setTotalCount(newTotalCount);
    };


    useEffect(() => {
        axios.get('http://localhost:3000/api/seats')
            .then(response => {
                const updatedSeats = response.data.map(seat => ({
                    seat_id: seat.seat_id,
                    isSelected: false,
                    isBooked: seat.is_reserved,
                }));
                setSeats(updatedSeats);
                setBaseSeatState(updatedSeats)
            })
            .catch(error => {
                console.error("There was an error fetching the seats:", error);
            });
    }, []);

    return (
        <div className="grid grid-cols-7 gap-2 w-full max-w-full max-h-screen">
            {seats.map((seat) => (
                <Seat
                    key={seat.seat_id}
                    seat={seat}
                    handleSeatChange={handleSeatChange}
                    isBooked={seat.isBooked}
                    isSelected={seat.isSelected}
                />
            ))}
        </div>
    );
};

export default SeatGrid;

