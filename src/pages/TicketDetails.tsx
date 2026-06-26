import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CountdownTimer } from '../components/CountdownTimer';
import { SeatMap } from '../components/SeatMap';
import { getTransportImage } from '../utils/imageMapper';

const getBadgeStyles = (type: string) => {
  const normalized = type?.toLowerCase() || '';
  if (normalized === 'flight') return 'bg-cyan-500 text-white';
  if (normalized === 'bus') return 'bg-emerald-500 text-white';
  if (normalized === 'train') return 'bg-indigo-500 text-white';
  return 'bg-blue-500 text-white';
};

interface Ticket {
  _id: string;
  title: string;
  from: string;
  to: string;
  price: number;
  quantity: number;
  transportType: string;
  departureTime: string;
  perks: string[];
  image: string;
  vendor: { name: string; email: string };
  seats: string[];
}

export const TicketDetails: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await api.get('/tickets/' + id);
        if (res.data.success) {
          setTicket(res.data.ticket);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Ticket Not Found</h2>
      </div>
    );
  }

  const isExpired = new Date(ticket.departureTime) < new Date();
  const isSoldOut = ticket.quantity === 0;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (selectedSeats.length !== quantity) {
      alert("Please select exactly " + quantity + " seat(s) on the map before booking.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/bookings', {
        ticketId: ticket._id,
        quantity,
        seats: selectedSeats
      });

      if (res.data.success) {
        alert('Booking successfully requested! Complete payment in your user dashboard once accepted.');
        navigate('/dashboard');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to place booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="relative h-96 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
            <img src={getTransportImage(ticket.transportType, ticket.image)} alt={ticket.title} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-8 text-white flex flex-col justify-end">
              <span className={`text-[10px] uppercase px-3 py-1 rounded-full w-fit font-black tracking-widest ${getBadgeStyles(ticket.transportType)}`}>{ticket.transportType}</span>
              <h1 className="text-2xl sm:text-4xl font-extrabold mt-3 leading-tight">{ticket.title}</h1>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-lg">Travel Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400">Route</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">{ticket.from} &rarr; {ticket.to}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Operator Vendor</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">{ticket.vendor.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Departure Schedule</p>
                <p className="font-semibold text-slate-700 dark:text-slate-350 mt-1">
                  {new Date(ticket.departureTime).toLocaleDateString()} at {new Date(ticket.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Available Tickets</p>
                <p className="font-bold text-slate-700 dark:text-slate-300 mt-1">{ticket.quantity} Left</p>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <p className="text-xs text-slate-400 mb-2 font-bold uppercase">Perks Included</p>
              <div className="flex flex-wrap gap-2">
                {ticket.perks.map((p, i) => (
                  <span key={i} className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-350">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <p className="text-xs text-slate-400">Price per seat</p>
                <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">${ticket.price}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Time until departure</p>
                <CountdownTimer targetDate={ticket.departureTime} />
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">1. Select Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={Math.min(ticket.quantity, 4)}
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(Number(e.target.value));
                    setSelectedSeats([]);
                  }}
                  disabled={isExpired || isSoldOut}
                  className="input input-bordered w-full bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">2. Select Seat Position(s)</label>
                <SeatMap
                  bookedSeats={ticket.seats}
                  selectedSeats={selectedSeats}
                  onSeatSelect={setSelectedSeats}
                  maxSelectable={quantity}
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl flex items-center justify-between font-bold text-sm">
                <span>Total Amount:</span>
                <span className="text-xl text-blue-600 dark:text-blue-400">${ticket.price * quantity}</span>
              </div>

              <button
                type="submit"
                disabled={isExpired || isSoldOut || isSubmitting}
                className="btn btn-primary w-full bg-blue-600 border-none hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/25 py-3 h-auto"
              >
                {isExpired
                  ? 'Departure Time Passed'
                  : isSoldOut
                  ? 'Sold Out'
                  : isSubmitting
                  ? 'Processing Booking...'
                  : 'Book Now'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
