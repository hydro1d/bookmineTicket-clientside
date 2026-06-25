import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { TableSkeleton } from '../../../components/SkeletonLoader';
import { List, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';

interface Ticket {
  _id: string;
  title: string;
  from: string;
  to: string;
  price: number;
  quantity: number;
  transportType: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  departureTime: string;
}

export const MyTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets/all-vendor');
      if (res.data.success) {
        setTickets(res.data.tickets);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this schedule? All related bookings will lose mapping.")) return;
    try {
      const res = await api.delete('/tickets/' + id);
      if (res.data.success) {
        alert("Ticket deleted successfully!");
        fetchTickets();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete ticket');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">My Tickets</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your uploaded travel tickets, verification status, and seat lists</p>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : tickets.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <List className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500">You haven't listed any tickets yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th>Title / Transport</th>
                  <th>Route</th>
                  <th>Available Seats</th>
                  <th>Ticket Price</th>
                  <th>Verification</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket._id} className="border-b border-slate-100 dark:border-slate-850">
                    <td>
                      <div className="font-bold">{ticket.title}</div>
                      <div className="text-xs text-slate-450 uppercase font-semibold">{ticket.transportType}</div>
                    </td>
                    <td>
                      <div className="font-semibold text-sm">{ticket.from} &rarr; {ticket.to}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{new Date(ticket.departureTime).toLocaleString()}</div>
                    </td>
                    <td className="font-bold text-slate-700 dark:text-slate-300">{ticket.quantity} Left</td>
                    <td className="font-extrabold text-slate-800 dark:text-white">${ticket.price}</td>
                    <td>
                      <span className={"badge font-semibold capitalize border-none " + (
                        ticket.verificationStatus === 'approved'
                          ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                          : ticket.verificationStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                      )}>
                        {ticket.verificationStatus}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(ticket._id)}
                        className="btn btn-error btn-xs btn-outline rounded-lg flex items-center"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
