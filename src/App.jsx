
import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Form from './pages/Form';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import LogoutRoute from './components/LogoutRoute';
import Footer from './components/Footer';



export default function App() {
  // ========================= Initial Data =========================

  // ========================= UI =========================
  return (
    <>
      <Navbar></Navbar>
      <ToastContainer position="top-right" rtl autoClose={3000} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/form' element={<Form />} />
        <Route path='/admin' element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/register" element={<LogoutRoute><Register /> </LogoutRoute>} />
        <Route path="/login" element={<LogoutRoute><Login /></LogoutRoute>} />
      </Routes>
      <Footer />
    </>
  );
}
