import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Nav from './components/Nav';
import NotFound from '../pages/NotFound';
import Register from '../pages/Register';
import { AppointmentProvider } from '@/components/contexts/AppointmentContext.jsx';
import { ClientProvider } from '@/components/contexts/ClientContext.jsx';
import { IsLoadingProvider } from '@/components/contexts/IsLoadingContext';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { UserProvider } from './components/contexts/UserContext.jsx';

function App() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  const cookieValue = document.cookie.split('=')[1];
  cookieValue === 'true' ? <Outlet /> : <Navigate to='/login' />;

  return (
    <div className='flex flex-col h-screen'>
      {!isDashboardRoute && <Nav />}
      <UserProvider>
        <AppointmentProvider>
          <ClientProvider>
            <IsLoadingProvider>
              <Routes>
                <Route
                  path='/'
                  element={
                    cookieValue === 'true' ? (
                      <Navigate to='/dashboard/home' />
                    ) : (
                      <Home />
                    )
                  }
                />
                <Route
                  path='/register'
                  element={
                    cookieValue === 'true' ? (
                      <Navigate to='/dashboard/home' />
                    ) : (
                      <Register />
                    )
                  }
                />
                <Route
                  path='/login'
                  element={
                    cookieValue === 'true' ? (
                      <Navigate to='/dashboard/home' />
                    ) : (
                      <Login />
                    )
                  }
                />
                <Route
                  path='/dashboard/*'
                  element={
                    cookieValue === 'true' ? (
                      <Dashboard />
                    ) : (
                      <Navigate to='/login' />
                    )
                  }
                />
                <Route
                  path='/dashboard'
                  element={<Navigate to='/dashboard/home' />}
                />
                <Route path='/*' element={<NotFound />} />
              </Routes>
            </IsLoadingProvider>
          </ClientProvider>
        </AppointmentProvider>
      </UserProvider>
    </div>
  );
}

export default App;
