import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { PlusCircle } from 'lucide-react';

export const AddTicket: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [transportType, setTransportType] = useState('bus');
  const [price, setPrice] = useState(10);
  const [quantity, setQuantity] = useState(40);
  const [departureTime, setDepartureTime] = useState('');
  const [perkInput, setPerkInput] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const perks = perkInput
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const fallbackImage = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600';

    try {
      const res = await api.post('/tickets', {
        title,
        from,
        to,
        transportType,
        price,
        quantity,
        departureTime,
        perks: perks.length > 0 ? perks : ['AC', 'Snack', 'WiFi'],
        image: image || fallbackImage
      });

      if (res.data.success) {
        alert("Ticket added successfully! Waiting for Admin verification approval.");
        navigate('/dashboard/my-tickets');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Add New Journey</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Publish a new ticket schedule, seat counts, and amenities</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Title</label>
              <input
                type="text"
                placeholder="Premium Express"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="input input-bordered w-full bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-455 uppercase mb-2">Vehicle Type</label>
              <select
                value={transportType}
                onChange={(e) => setTransportType(e.target.value)}
                className="select select-bordered w-full bg-slate-50 dark:bg-slate-800"
              >
                <option value="bus">Bus</option>
                <option value="train">Train</option>
                <option value="flight">Flight</option>
                <option value="ferry">Ferry</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">From</label>
              <input
                type="text"
                placeholder="e.g. Dhaka"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                required
                className="input input-bordered w-full bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">To</label>
              <input
                type="text"
                placeholder="e.g. Cox's Bazar"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
                className="input input-bordered w-full bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Price per Seat ($)</label>
              <input
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                className="input input-bordered w-full bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Total Seats</label>
              <input
                type="number"
                min="1"
                max="40"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
                className="input input-bordered w-full bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Departure Schedule</label>
              <input
                type="datetime-local"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                required
                className="input input-bordered w-full bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Perks Amenities (Comma separated)</label>
            <input
              type="text"
              placeholder="WiFi, AC, Sleeper, Water, Charging Port"
              value={perkInput}
              onChange={(e) => setPerkInput(e.target.value)}
              className="input input-bordered w-full bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-450 uppercase mb-2">Banner Image URL (Unsplash or ImgBB)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="input input-bordered w-full bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full bg-blue-600 border-none hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 py-3.5 h-auto font-bold flex items-center justify-center"
          >
            {loading && <span className="loading loading-spinner loading-sm mr-2"></span>}
            <PlusCircle className="w-5 h-5 mr-2" /> Add Schedule
          </button>
        </form>
      </div>
    </div>
  );
};
