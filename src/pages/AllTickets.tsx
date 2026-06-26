import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { CardSkeleton } from '../components/SkeletonLoader';
import { Search } from 'lucide-react';
import { getTransportImage } from '../utils/imageMapper';

const getBadgeStyles = (type: string) => {
  const normalized = type?.toLowerCase() || '';
  if (normalized === 'flight') return 'bg-cyan-50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-400 border border-cyan-200/40 dark:border-cyan-900/40';
  if (normalized === 'bus') return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-900/40';
  if (normalized === 'train') return 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200/40 dark:border-indigo-900/40';
  return 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-200/40 dark:border-blue-900/40';
};

const getTransportIcon = (type: string) => {
  const normalized = type?.toLowerCase() || '';
  if (normalized === 'flight') return '✈️';
  if (normalized === 'bus') return '🚌';
  if (normalized === 'train') return '🚆';
  return '🚢';
};

interface Ticket {
  _id: string;
  title: string;
  from: string;
  to: string;
  price: number;
  quantity: number;
  transportType: string;
  perks: string[];
  image: string;
  departureTime: string;
}

export const AllTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [transportType, setTransportType] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tickets', {
        params: { from, to, transportType, sort, page, limit: 6 }
      });
      if (res.data.success) {
        setTickets(res.data.tickets);
        setTotalPages(res.data.pages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page, transportType, sort]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTickets();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold">Available Journeys</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Filter schedules, compare prices and book your seat</p>
      </div>

      <form onSubmit={handleSearch} className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">From</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. Dhaka"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="input input-bordered w-full pl-10 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">To</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. Cox's Bazar"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="input input-bordered w-full pl-10 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Vehicle</label>
            <select
              value={transportType}
              onChange={(e) => setTransportType(e.target.value)}
              className="select select-bordered w-full bg-slate-50 dark:bg-slate-800"
            >
              <option value="">All Type</option>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
              <option value="flight">Flight</option>
              <option value="ferry">Ferry</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Price Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="select select-bordered w-full bg-slate-50 dark:bg-slate-800"
            >
              <option value="">Default</option>
              <option value="low-to-high">Low to High</option>
              <option value="high-to-low">High to Low</option>
            </select>
          </div>
        </div>
        <div>
          <button type="submit" className="btn btn-primary w-full bg-blue-600 border-none hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20">
            Search Schedules
          </button>
        </div>
      </form>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <p className="text-slate-500 dark:text-slate-400 text-lg">No approved tickets match your query criteria.</p>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
                <div className="relative overflow-hidden">
                  <img src={getTransportImage(ticket.transportType, ticket.image)} alt={ticket.title} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                </div>
                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full ${getBadgeStyles(ticket.transportType)}`}>
                      <span className="text-xs">{getTransportIcon(ticket.transportType)}</span> {ticket.transportType}
                    </span>
                    <h3 className="font-extrabold text-lg leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{ticket.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-bold flex items-center space-x-1.5">
                      <span>{ticket.from}</span>
                      <span className="text-slate-400 font-normal">➔</span>
                      <span>{ticket.to}</span>
                    </p>
                    <p className="text-[11px] font-semibold text-slate-400 mt-1.5 bg-slate-50 dark:bg-slate-850 px-2 py-1 rounded w-fit">
                      Departs: {new Date(ticket.departureTime).toLocaleDateString()} at {new Date(ticket.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap pt-2">
                    {ticket.perks.slice(0, 3).map((p, idx) => (
                      <span key={idx} className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-350 border border-slate-100 dark:border-slate-800/50 text-[10px] font-bold px-2.5 py-1 rounded-lg">{p}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-4">
                    <div>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Price per Seat</p>
                      <p className="text-2xl font-black text-blue-600 dark:text-blue-400">${ticket.price}</p>
                    </div>
                    <Link to={'/tickets/' + ticket._id} className="btn btn-primary btn-sm bg-blue-600 border-none hover:bg-blue-700 text-white rounded-xl px-5 font-bold shadow-md shadow-blue-500/15">
                      See Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 pt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                className="btn btn-sm btn-outline border-slate-350 dark:border-slate-800"
              >
                Prev
              </button>
              <span className="text-sm font-semibold text-slate-500">Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                className="btn btn-sm btn-outline border-slate-350 dark:border-slate-800"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
