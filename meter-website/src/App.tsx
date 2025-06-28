import { Route, BrowserRouter , Routes } from 'react-router-dom';
import './App.css';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<UserRoutes/>} />
        <Route path='/admin*' element={<AdminRoutes/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
