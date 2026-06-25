import React from 'react';

interface SeatMapProps {
  bookedSeats: string[];
  selectedSeats: string[];
  onSeatSelect: (seats: string[]) => void;
  maxSelectable: number;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  bookedSeats,
  selectedSeats,
  onSeatSelect,
  maxSelectable
}) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const columns = ['1', '2', '3', '4'];

  const handleSeatClick = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      onSeatSelect(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length >= maxSelectable) {
        alert("You can only select up to " + maxSelectable + " seats matching your quantity");
        return;
      }
      onSeatSelect([...selectedSeats, seatId]);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-inner">
      <div className="flex items-center justify-center space-x-6 text-xs mb-6">
        <div className="flex items-center space-x-1.5">
          <div className="w-4 h-4 bg-white dark:bg-slate-800 border border-slate-350 dark:border-slate-700 rounded"></div>
          <span className="text-slate-600 dark:text-slate-400">Available</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-4 h-4 bg-blue-600 dark:bg-blue-500 rounded"></div>
          <span className="text-slate-600 dark:text-slate-400">Selected</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-4 h-4 bg-slate-300 dark:bg-slate-700 rounded cursor-not-allowed"></div>
          <span className="text-slate-600 dark:text-slate-400">Booked</span>
        </div>
      </div>

      <div className="border-b border-slate-300 dark:border-slate-800 pb-2 mb-4 flex items-center justify-between text-xs text-slate-500 font-bold px-2">
        <span>FRONT / DRIVER</span>
        <div className="w-6 h-6 border-2 border-slate-400 rounded-full flex items-center justify-center">O</div>
      </div>

      <div className="grid gap-2.5">
        {rows.map(row => (
          <div key={row} className="flex items-center justify-between">
            <div className="flex space-x-2.5">
              {columns.slice(0, 2).map(col => {
                const seatId = row + col;
                const isBooked = bookedSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);

                return (
                  <button
                    key={seatId}
                    disabled={isBooked}
                    type="button"
                    onClick={() => handleSeatClick(seatId)}
                    className={"w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all border " + (
                      isBooked
                        ? 'bg-slate-300 dark:bg-slate-700 border-transparent text-slate-500 cursor-not-allowed'
                        : isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-blue-500 text-slate-800 dark:text-slate-200'
                    )}
                  >
                    {seatId}
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-bold text-slate-400 w-6 text-center">{row}</div>

            <div className="flex space-x-2.5">
              {columns.slice(2, 4).map(col => {
                const seatId = row + col;
                const isBooked = bookedSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);

                return (
                  <button
                    key={seatId}
                    disabled={isBooked}
                    type="button"
                    onClick={() => handleSeatClick(seatId)}
                    className={"w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all border " + (
                      isBooked
                        ? 'bg-slate-300 dark:bg-slate-700 border-transparent text-slate-500 cursor-not-allowed'
                        : isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-blue-500 text-slate-800 dark:text-slate-200'
                    )}
                  >
                    {seatId}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
