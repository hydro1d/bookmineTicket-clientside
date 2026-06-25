import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { TableSkeleton } from '../../../components/SkeletonLoader';
import { Ticket, FileDown, CreditCard, Trash2 } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface Booking {
  _id: string;
  ticket: {
    _id: string;
    title: string;
    from: string;
    to: string;
    price: number;
    departureTime: string;
    transportType: string;
  };
  quantity: number;
  totalPrice: number;
  seats: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'paid';
  paymentIntentId?: string;
  createdAt: string;
}

export const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/user-bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await api.delete('/bookings/' + id);
      if (res.data.success) {
        alert("Booking cancelled successfully!");
        fetchBookings();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  const handleDownloadPDF = (booking: Booking) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a6'
    });

    // Ticket Header
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, 105, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('TicketBari Pass', 10, 15);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Secure Boarding Pass & Receipt', 10, 22);

    // Ticket Content
    doc.setTextColor(51, 65, 85);
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Booking ID:', 10, 40);
    doc.setFont('Helvetica', 'normal');
    doc.text(booking._id, 35, 40);

    doc.setFont('Helvetica', 'bold');
    doc.text('Journey Route:', 10, 48);
    doc.setFont('Helvetica', 'normal');
    doc.text(booking.ticket?.title || 'Travel route', 35, 48);

    doc.setFont('Helvetica', 'bold');
    doc.text('From & To:', 10, 56);
    doc.setFont('Helvetica', 'normal');
    doc.text((booking.ticket?.from || '') + ' to ' + (booking.ticket?.to || ''), 35, 56);

    doc.setFont('Helvetica', 'bold');
    doc.text('Departure:', 10, 64);
    doc.setFont('Helvetica', 'normal');
    doc.text(new Date(booking.ticket?.departureTime).toLocaleString(), 35, 64);

    doc.setFont('Helvetica', 'bold');
    doc.text('Seats Info:', 10, 72);
    doc.setFont('Helvetica', 'normal');
    doc.text(booking.seats?.join(', ') || 'N/A', 35, 72);

    doc.setFont('Helvetica', 'bold');
    doc.text('Price Paid:', 10, 80);
    doc.setFont('Helvetica', 'normal');
    doc.text('$' + booking.totalPrice, 35, 80);

    doc.setFont('Helvetica', 'bold');
    doc.text('Txn Ref ID:', 10, 88);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(booking.paymentIntentId || 'MOCK-ST-TXN', 35, 88);

    // Footer bar
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 138, 105, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Happy Journey with TicketBari!', 25, 144);

    doc.save('ticket-' + booking._id + '.pdf');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">My Bookings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Track booking status, process payments, and export tickets</p>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <Ticket className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500">You haven't requested any tickets yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th>Journey / Route</th>
                  <th>Quantity & Seats</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const isExpired = new Date(booking.ticket?.departureTime) < new Date();
                  return (
                    <tr key={booking._id} className="border-b border-slate-100 dark:border-slate-850">
                      <td>
                        <div className="font-bold">{booking.ticket?.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {booking.ticket?.from} &rarr; {booking.ticket?.to} | Departs: {new Date(booking.ticket?.departureTime).toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <div className="font-semibold">{booking.quantity} Seat(s)</div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-bold">{booking.seats.join(', ')}</div>
                      </td>
                      <td className="font-extrabold text-slate-800 dark:text-white">${booking.totalPrice}</td>
                      <td>
                        <span className={"badge font-semibold capitalize border-none " + (
                          booking.status === 'paid'
                            ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                            : booking.status === 'accepted'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                        )}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          {booking.status === 'pending' && !isExpired && (
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              className="btn btn-error btn-xs btn-outline rounded-lg flex items-center"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" /> Cancel
                            </button>
                          )}
                          {booking.status === 'accepted' && !isExpired && (
                            <button
                              onClick={() => navigate('/dashboard/pay/' + booking._id)}
                              className="btn btn-primary btn-xs bg-blue-600 hover:bg-blue-700 border-none text-white rounded-lg flex items-center shadow-md shadow-blue-500/20"
                            >
                              <CreditCard className="w-3.5 h-3.5 mr-1" /> Pay Now
                            </button>
                          )}
                          {booking.status === 'paid' && (
                            <button
                              onClick={() => handleDownloadPDF(booking)}
                              className="btn btn-ghost btn-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg flex items-center"
                            >
                              <FileDown className="w-3.5 h-3.5 mr-1" /> Ticket PDF
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
