import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import PrivateRoute from '@/components/route/PrivateRoute';
import Home from '@/pages/home/Home';
import About from '@/pages/about/About';
import SignIn from '@/pages/auth/SignIn';
import SignUp from '@/pages/auth/SignUp';
import Profile from '@/pages/user/Profile';
import Dashboard from '@/pages/user/Dashboard';
import Favorites from '@/pages/favorite/Favorites';
import MyBookings from '@/pages/booking/MyBookings';
import Blog from '@/pages/blog/Blog';
import BlogDetail from '@/pages/blog/BlogDetail';
import Listing from '@/pages/listing/Listing';
import Search from '@/pages/listing/Search';
import CreateListing from '@/pages/listing/CreateListing';
import UpdateListing from '@/pages/listing/UpdateListing';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'sign-in', element: <SignIn /> },
      { path: 'sign-up', element: <SignUp /> },
      { path: 'about', element: <About /> },
      { path: 'search', element: <Search /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:postId', element: <BlogDetail /> },
      { path: 'listing/:listingId', element: <Listing /> },
      {
        element: <PrivateRoute />,
        children: [
          { path: 'profile', element: <Profile /> },
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'favorites', element: <Favorites /> },
          { path: 'bookings', element: <MyBookings /> },
          { path: 'create-listing', element: <CreateListing /> },
          { path: 'update-listing/:listingId', element: <UpdateListing /> },
        ],
      },
    ],
  },
]);
