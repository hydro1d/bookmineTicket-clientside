import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { TableSkeleton } from '../../../components/SkeletonLoader';
import { CheckCircle, XCircle } from 'lucide-react';

interface Ticket {
  _id: string;
  title: string;
  from: string;
  to: string;
  price: number;
  transportType: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  vendor: { name: string; email: string };
  departureTime: string;
}

export const ManageTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllTickets = async () => {
    try {
      const res = await api.get('/tickets/admin-all');
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
    fetchAllTickets();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    if (!window.confirm("Confirm updating verification status to: " + status + "?")) return;
    try {
      const res = await api.put('/tickets/' + id + '/status', { status });
      if (res.data.success) {
        alert("Ticket status successfully set to: " + status);
        fetchAllTickets();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Verify Schedules</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Approve or reject routes posted by active vendors</p>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : tickets.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <p className="text-slate-500">No schedules listed by vendors yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th>Ticket / Vendor</th>
                  <th>Route Info</th>
                  <th>Price</th>
                  <th>Verification</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket._id} className="border-b border-slate-100 dark:border-slate-850">
                    <td>
                      <div className="font-bold">{ticket.title}</div>
                      <div className="text-xs text-slate-400">
                        By: {ticket.vendor?.name || 'N/A'} ({ticket.vendor?.email})
                      </div>
                    </td>
                    <td>
                      <div className="font-semibold text-sm">{ticket.from} &rarr; {ticket.to}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {new Date(ticket.departureTime).toLocaleString()} | <span className="capitalize font-bold text-blue-600 dark:text-blue-400">{ticket.transportType}</span>
                      </div>
                    </td>
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
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(ticket._id, 'approved')}
                          disabled={ticket.verificationStatus === 'approved'}
                          className="btn btn-success btn-xs text-white rounded-lg flex items-center"
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(ticket._id, 'rejected')}
                          disabled={ticket.verificationStatus === 'rejected'}
                          className="btn btn-error btn-xs text-white rounded-lg flex items-center"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                        </button>
                      </div>
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
