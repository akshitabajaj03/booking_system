const Seat = ({ seat, handleSeatChange }) => {
    return (
        <>
            <input
                type="checkbox"
                id={seat.seat_id}
                name="tickets"
                disabled={seat.isBooked}
                checked={seat.isSelected}
                onChange={() => handleSeatChange(seat.seat_id)}
                className="hidden"
            />
            <label
                htmlFor={seat.seat_id}
                className={`
                    flex items-center justify-center rounded-md cursor-pointer transition-all duration-300
                    border-2 
                    ${seat.isBooked ? 'bg-gray-400 cursor-not-allowed border-gray-500' : 'bg-white border-gray-300'} 
                    ${seat.isSelected ? 'bg-blue-500 border-blue-700' : ''}  
                    hover:scale-110
                `}
            >
                {seat.seat_id}
            </label>
        </>
    );
};

export default Seat;
