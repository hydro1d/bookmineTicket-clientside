import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { CardSkeleton } from '../components/SkeletonLoader';
import { ArrowRight, Award, ShieldCheck, Compass } from 'lucide-react';

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
}

export const Home: React.FC = () => {
  const [ads, setAds] = useState<Ticket[]>([]);
  const [latest, setLatest] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const adRes = await api.get('/tickets/advertised');
        const allRes = await api.get('/tickets?limit=6');
        
        if (adRes.data.success) setAds(adRes.data.tickets);
        if (allRes.data.success) setLatest(allRes.data.tickets);
      } catch (err) {
        console.error('Failed to load tickets', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      <section className="relative bg-gradient-to-br from-blue-900 to-indigo-950 text-white min-h-[600px] flex items-center overflow-hidden py-16 px-4">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          <div className="space-y-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              ✈️ Secure Online Travel Tickets
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              Book Tickets For <br/>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Your Next Journey</span>
            </h1>
            <p className="text-lg text-slate-350 max-w-lg leading-relaxed">
              TicketBari is the most reliable online reservation portal. Instant payment verification, seat maps selection, and role-based panels for users and vendors.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/tickets" className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-none text-white px-8 rounded-xl shadow-lg shadow-blue-500/25 flex items-center">
                Explore Tickets <ArrowRight className="w-4 h-4 ml-2 animate-pulse" />
              </Link>
              <a href="#why-us" className="btn btn-outline border-slate-700 text-white hover:bg-slate-800 rounded-xl px-8">
                Why Choose Us
              </a>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600"
              alt="Premium Travel Tech illustration"
              className="rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/10"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Recruiter Ad Spotlights</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Handpicked premium tickets highlighted by admins</p>
          </div>
          <Link to="/tickets" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center">
            View All Tickets <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : ads.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl">
            <p className="text-slate-500 dark:text-slate-400">No advertised tickets currently. Admin approval needed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ads.map((ticket) => (
              <div key={ticket._id} className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all group flex flex-col justify-between">
                <div className="relative">
                  <img src={ticket.image} alt={ticket.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-4 right-4 bg-yellow-500 text-slate-950 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">AD</span>
                </div>
                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">{ticket.transportType}</span>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{ticket.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{ticket.from} &rarr; {ticket.to}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap pt-2">
                    {ticket.perks.slice(0, 3).map((p, idx) => (
                      <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-[10px] font-medium px-2 py-1 rounded-md">{p}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                    <div>
                      <p className="text-xs text-slate-400">Price per Seat</p>
                      <p className="text-xl font-extrabold text-slate-900 dark:text-white">${ticket.price}</p>
                    </div>
                    <Link to={'/tickets/' + ticket._id} className="btn btn-primary btn-sm bg-blue-600 border-none hover:bg-blue-700 text-white rounded-lg px-4">
                      See Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Latest Open Tickets</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Recently verified and approved travel schedules</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latest.map((ticket) => (
              <div key={ticket._id} className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all group flex flex-col justify-between">
                <img src={ticket.image} alt={ticket.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">{ticket.transportType}</span>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{ticket.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{ticket.from} &rarr; {ticket.to}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap pt-2">
                    {ticket.perks.slice(0, 3).map((p, idx) => (
                      <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-[10px] font-medium px-2 py-1 rounded-md">{p}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                    <div>
                      <p className="text-xs text-slate-400">Price per Seat</p>
                      <p className="text-xl font-extrabold text-slate-900 dark:text-white">${ticket.price}</p>
                    </div>
                    <Link to={'/tickets/' + ticket._id} className="btn btn-primary btn-sm bg-blue-600 border-none hover:bg-blue-700 text-white rounded-lg px-4">
                      See Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-slate-100/50 dark:bg-slate-900/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold">Popular Travel Routes</h2>
            <p className="text-slate-500 dark:text-slate-400">Top-rated pathways across local destinations</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { route: "Dhaka to Cox's Bazar", time: '8 Hours', price: '$22', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=150' },
              { route: 'Dhaka to Chittagong', time: '5 Hours', price: '$12', image: 'https://images.unsplash.com/photo-1532103054090-334e6e60ab29?auto=format&fit=crop&q=80&w=150' },
              { route: 'Dhaka to Sylhet', time: '6 Hours', price: '$10', image: 'https://images.unsplash.com/photo-1501446529957-6226bd447c46?auto=format&fit=crop&q=80&w=150' },
              { route: "Cox's Bazar to Saint Martin", time: '3 Hours', price: '$15', image: 'https://images.unsplash.com/photo-1473862170180-84427c485ade?auto=format&fit=crop&q=80&w=150' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl flex items-center space-x-4 border border-slate-200/50 dark:border-slate-800/50">
                <img src={item.image} alt={item.route} className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-sm text-slate-850 dark:text-white truncate">{item.route}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{item.time} duration</p>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1">Starting from {item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="why-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight">Why Choose TicketBari Services?</h2>
          <p className="text-slate-500 dark:text-slate-400">
            We provide a state-of-the-art ticket reservation system focusing on security, transparency, and role separation.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 dark:bg-blue-950 p-2.5 rounded-xl text-blue-600 dark:text-blue-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold">Verified Operators</h4>
                <p className="text-sm text-slate-500">Only authorized tickets checked by administrators appear on our lists.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 dark:bg-blue-950 p-2.5 rounded-xl text-blue-600 dark:text-blue-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold">Fraud Shield</h4>
                <p className="text-sm text-slate-500">Fraud vendors are instantly locked out, protecting user funds dynamically.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 dark:bg-blue-950 p-2.5 rounded-xl text-blue-600 dark:text-blue-400">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold">Interactive Seat Selector</h4>
                <p className="text-sm text-slate-500">See available layout formats and pick specific locations in seconds.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-3xl text-center space-y-2">
            <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">10k+</p>
            <p className="text-sm font-semibold text-slate-500">Tickets Booked</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-3xl text-center space-y-2">
            <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">120+</p>
            <p className="text-sm font-semibold text-slate-500">Active Operators</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-3xl text-center space-y-2">
            <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">99.9%</p>
            <p className="text-sm font-semibold text-slate-500">Uptime Reliability</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-3xl text-center space-y-2">
            <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">$200k</p>
            <p className="text-sm font-semibold text-slate-500">Secure Volume</p>
          </div>
        </div>
      </section>
    </div>
  );
};
