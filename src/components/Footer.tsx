import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Mail, Phone, MapPin, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-xl text-white">
                <Ticket className="w-6 h-6 rotate-12" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                TicketBari
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              TicketBari is Bangladesh's premium online ticket reservation gateway. Book buses, trains, flights, and ferries securely with direct credit card integrations.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/tickets" className="hover:text-white transition-colors">All Tickets</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Login / Auth</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-blue-500" /> Banani, Dhaka, Bangladesh</li>
              <li className="flex items-center"><Phone className="w-4 h-4 mr-2 text-blue-500" /> +880 1712-345678</li>
              <li className="flex items-center"><Mail className="w-4 h-4 mr-2 text-blue-500" /> support@ticketbari.com</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Secured Payments</h4>
            <div className="space-y-3 text-sm">
              <p className="flex items-center"><Shield className="w-4 h-4 mr-2 text-green-500" /> Stripe Certified Gateway</p>
              <div className="flex space-x-2 pt-2">
                <div className="bg-slate-800 px-3 py-1.5 rounded border border-slate-700 text-xs font-semibold text-slate-300 tracking-wider">STRIPE</div>
                <div className="bg-slate-800 px-3 py-1.5 rounded border border-slate-700 text-xs font-semibold text-slate-300 tracking-wider">VISA</div>
                <div className="bg-slate-800 px-3 py-1.5 rounded border border-slate-700 text-xs font-semibold text-slate-300 tracking-wider">MASTERCARD</div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} TicketBari Platform Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
