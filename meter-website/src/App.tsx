import { Route, BrowserRouter , Routes } from 'react-router-dom';
import './App.css';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';

function App() {
  return (
      <Routes>
        <Route path='/*' element={<UserRoutes/>} />
        <Route path='/admin*' element={<AdminRoutes/>}/>
      </Routes>
  );
}

export default App;
