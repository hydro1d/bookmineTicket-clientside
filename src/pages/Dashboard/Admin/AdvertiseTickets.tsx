import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { TableSkeleton } from '../../../components/SkeletonLoader';
import { Award, Compass } from 'lucide-react';

interface Ticket {
  _id: string;
  title: string;
  from: string;
  to: string;
  price: number;
  transportType: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  isAdvertised: boolean;
}

export const AdvertiseTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovedTickets = async () => {
    try {
      const res = await api.get('/tickets/admin-all');
      if (res.data.success) {
        const approvedOnly = res.data.tickets.filter((t: Ticket) => t.verificationStatus === 'approved');
        setTickets(approvedOnly);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedTickets();
  }, []);

  const handleToggleAdvertise = async (id: string, currentVal: boolean) => {
    const advertisedCount = tickets.filter(t => t.isAdvertised).length;
    if (!currentVal && advertisedCount >= 6) {
      alert("Platform limits active: You can advertise a maximum of 6 spotlight items simultaneously.");
      return;
    }

    try {
      const res = await api.put('/tickets/' + id + '/advertise');
      if (res.data.success) {
        alert("Advertisement status updated successfully!");
        fetchApprovedTickets();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle advertisement status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Advertise Spotlights</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Select and highlight up to 6 premium itineraries for the client homepage carousel</p>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : tickets.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <p className="text-slate-500">No approved tickets are available for promotion yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th>Itinerary Title</th>
                  <th>Route</th>
                  <th>Price</th>
                  <th>Spotlight State</th>
                  <th>Toggle Switch</th>
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
                    </td>
                    <td className="font-extrabold text-slate-800 dark:text-white">${ticket.price}</td>
                    <td>
                      <span className={"badge font-semibold capitalize border-none " + (
                        ticket.isAdvertised
                          ? 'bg-yellow-100 text-yellow-750 dark:bg-yellow-950/40 dark:text-yellow-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      )}>
                        {ticket.isAdvertised ? 'Advertised spotlight' : 'Standard listing'}
                      </span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={ticket.isAdvertised}
                        onChange={() => handleToggleAdvertise(ticket._id, ticket.isAdvertised)}
                        className="toggle toggle-primary toggle-sm"
                      />
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
