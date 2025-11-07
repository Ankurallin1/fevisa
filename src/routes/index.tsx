import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Services from '../pages/Services';
import Universities from '../pages/Universities';
import UniversityDetail from '../pages/UniversityDetail';
import ServiceDetail from '../pages/ServiceDetail';
import VisaDetail from '../pages/VisaDetail';
import Contact from '../pages/Contact';
import Book from '../pages/Book';
import BookingConfirm from '../pages/BookingConfirm';
import Reschedule from '../pages/Reschedule';
import Dashboard from '../pages/Dashboard';
import Admin from '../pages/Admin';
import PaymentSuccess from '../pages/PaymentSuccess';
import PaymentCancel from '../pages/PaymentCancel';
import { Auth } from '../pages/Auth';
import { PrivateRoute } from '../components/PrivateRoute';
import { OpenRoute } from '../components/OpenRoute';
import { AdminRoute } from '../components/AdminRoute';
import { UserRoute } from '../components/UserRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <OpenRoute>
            <Home />
          </OpenRoute>
        ),
      },
      {
        path: 'services',
        element: (
          <OpenRoute>
            <Services />
          </OpenRoute>
        ),
      },
      {
        path: 'universities',
        element: (
          <OpenRoute>
            <Universities />
          </OpenRoute>
        ),
      },
      {
        path: 'contact',
        element: (
          <OpenRoute>
            <Contact />
          </OpenRoute>
        ),
      },
      {
        path: 'universities/:slug',
        element: (
          <OpenRoute>
            <UniversityDetail />
          </OpenRoute>
        ),
      },
      {
        path: 'services/:slug',
        element: (
          <OpenRoute>
            <ServiceDetail />
          </OpenRoute>
        ),
      },
      {
        path: 'visa/:slug',
        element: (
          <OpenRoute>
            <VisaDetail />
          </OpenRoute>
        ),
      },
      {
        path: 'book',
        element: (
          <OpenRoute>
            <Book />
          </OpenRoute>
        ),
      },
      {
        path: 'booking/confirm/:ref',
        element: (
          <OpenRoute>
            <BookingConfirm />
          </OpenRoute>
        ),
      },
      {
        path: 'booking/reschedule/:bookingId',
        element: (
          <PrivateRoute>
            <Reschedule />
          </PrivateRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <UserRoute>
            <Dashboard />
          </UserRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <AdminRoute>
            <Admin />
          </AdminRoute>
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: (
      <OpenRoute>
        <Auth />
      </OpenRoute>
    ),
  },
  {
    path: '/booking/payment/success',
    element: (
      <OpenRoute>
        <PaymentSuccess />
      </OpenRoute>
    ),
  },
  {
    path: '/booking/payment/cancel',
    element: (
      <OpenRoute>
        <PaymentCancel />
      </OpenRoute>
    ),
  },
]);
