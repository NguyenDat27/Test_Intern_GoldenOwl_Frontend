import { Routes, Route } from 'react-router-dom';
import UserRoute from './routes/userRoute';
import AdminRoute from './routes/adminRoute';
import Home from "./pages/user/home"
import Login from "./pages/auth/login"
import Dashboard from './pages/admin/dashboard';
import PageNotFound from './pages/pageNotFound';
import Register from './pages/auth/register';

function App() {
  return ( 
      <>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path='/' element={
          <UserRoute>
            <Home/>
          </UserRoute>
        }/>
        <Route path='/dashboard' element={
          <AdminRoute>
            <Dashboard/>
          </AdminRoute>
        }/>
        <Route path='*' element={<PageNotFound/>}/>
      </Routes>
    </>
  );
}
export default App;