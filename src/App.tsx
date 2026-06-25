import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PrivateRoute } from './components/PrivateRoute';

// Public Pages
import { Home } from './pages/Home';
import { AllTickets } from './pages/AllTickets';
import { TicketDetails } from './pages/TicketDetails';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Error404 } from './pages/Error404';

// Dashboard Layout & Shared Pages
import { DashboardLayout } from './layouts/DashboardLayout';
import { UserProfile } from './pages/Dashboard/UserProfile';

// User Dashboard Pages
import { MyBookings } from './pages/Dashboard/User/MyBookings';
import { PayBooking } from './pages/Dashboard/User/PayBooking';
import { MyTransactions } from './pages/Dashboard/User/MyTransactions';

// Vendor Dashboard Pages
import { AddTicket } from './pages/Dashboard/Vendor/AddTicket';
import { MyTickets } from './pages/Dashboard/Vendor/MyTickets';
import { RequestedBookings } from './pages/Dashboard/Vendor/RequestedBookings';
import { VendorRevenue } from './pages/Dashboard/Vendor/VendorRevenue';

// Admin Dashboard Pages
import { AdminStats } from './pages/Dashboard/Admin/AdminStats';
import { ManageTickets } from './pages/Dashboard/Admin/ManageTickets';
import { ManageUsers } from './pages/Dashboard/Admin/ManageUsers';
import { AdvertiseTickets } from './pages/Dashboard/Admin/AdvertiseTickets';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/tickets" element={<PublicLayout><AllTickets /></PublicLayout>} />
        <Route path="/tickets/:id" element={<PublicLayout><TicketDetails /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

        {/* Dashboard Role-based Routes */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          {/* Shared Portal Landing */}
          <Route index element={<UserProfile />} />

          {/* User Specific Paths */}
          <Route path="bookings" element={<PrivateRoute allowedRoles={['user']}><MyBookings /></PrivateRoute>} />
          <Route path="pay/:id" element={<PrivateRoute allowedRoles={['user']}><PayBooking /></PrivateRoute>} />
          <Route path="transactions" element={<PrivateRoute allowedRoles={['user']}><MyTransactions /></PrivateRoute>} />

          {/* Vendor Specific Paths */}
          <Route path="add-ticket" element={<PrivateRoute allowedRoles={['vendor']}><AddTicket /></PrivateRoute>} />
          <Route path="my-tickets" element={<PrivateRoute allowedRoles={['vendor']}><MyTickets /></PrivateRoute>} />
          <Route path="requested-bookings" element={<PrivateRoute allowedRoles={['vendor']}><RequestedBookings /></PrivateRoute>} />
          <Route path="revenue" element={<PrivateRoute allowedRoles={['vendor']}><VendorRevenue /></PrivateRoute>} />

          {/* Admin Specific Paths */}
          <Route path="stats" element={<PrivateRoute allowedRoles={['admin']}><AdminStats /></PrivateRoute>} />
          <Route path="manage-tickets" element={<PrivateRoute allowedRoles={['admin']}><ManageTickets /></PrivateRoute>} />
          <Route path="manage-users" element={<PrivateRoute allowedRoles={['admin']}><ManageUsers /></PrivateRoute>} />
          <Route path="advertise" element={<PrivateRoute allowedRoles={['admin']}><AdvertiseTickets /></PrivateRoute>} />
        </Route>

        {/* Fallback 404 Route */}
        <Route path="*" element={<PublicLayout><Error404 /></PublicLayout>} />
      </Routes>
    </Router>
  );
};

export default App;
