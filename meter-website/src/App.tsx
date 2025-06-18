import { Route, BrowserRouter , Routes } from 'react-router-dom';
import './App.css';
import UserRoutes from './routes/userRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<UserRoutes/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
