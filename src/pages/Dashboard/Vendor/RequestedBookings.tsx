import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { TableSkeleton } from '../../../components/SkeletonLoader';
import { FileText, CheckCircle, XCircle } from 'lucide-react';

interface Booking {
  _id: string;
  user: { name: string; email: string };
  ticket: { title: string; from: string; to: string };
  quantity: number;
  totalPrice: number;
  seats: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'paid';
  createdAt: string;
}

export const RequestedBookings: React.FC = () => {
  const [requests, setRequests] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/bookings/vendor-bookings');
      if (res.data.success) {
        setRequests(res.data.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'accepted' | 'rejected') => {
    if (!window.confirm("Are you sure you want to " + status + " this booking request?")) return;
    try {
      const res = await api.put('/bookings/' + id + '/status', { status });
      if (res.data.success) {
        alert("Booking request status updated to: " + status);
        fetchRequests();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Requested Bookings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage passenger seat bookings, accept requests, or reject allocations</p>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : requests.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500">No booking requests received yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th>Passenger Info</th>
                  <th>Route / Ticket</th>
                  <th>Seats</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id} className="border-b border-slate-100 dark:border-slate-850">
                    <td>
                      <div className="font-bold">{req.user?.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{req.user?.email}</div>
                    </td>
                    <td>
                      <div className="font-semibold text-sm">{req.ticket?.title}</div>
                      <div className="text-xs text-slate-400">{req.ticket?.from} &rarr; {req.ticket?.to}</div>
                    </td>
                    <td>
                      <div className="font-bold text-xs text-blue-600 dark:text-blue-400">{req.seats.join(', ')}</div>
                      <div className="text-[10px] text-slate-400">{req.quantity} seat(s)</div>
                    </td>
                    <td className="font-extrabold text-slate-800 dark:text-white">${req.totalPrice}</td>
                    <td>
                      <span className={"badge font-semibold capitalize border-none " + (
                        req.status === 'paid'
                          ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                          : req.status === 'accepted'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                          : req.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                      )}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      {req.status === 'pending' ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateStatus(req._id, 'accepted')}
                            className="btn btn-success btn-xs text-white rounded-lg flex items-center"
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Accept
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req._id, 'rejected')}
                            className="btn btn-error btn-xs text-white rounded-lg flex items-center"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold uppercase">Resolved</span>
                      )}
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
