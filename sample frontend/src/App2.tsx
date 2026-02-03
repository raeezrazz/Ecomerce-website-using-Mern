import { Route, Routes } from 'react-router-dom';
import './App.css';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import { FormDialogProvider } from '@/contexts/FormDialogContext';

function App() {
  return (
    <div className="w-full min-h-screen">
      <FormDialogProvider>
        <Routes>
          <Route path='/*' element={<UserRoutes/>} />
          <Route path='/admin/*' element={<AdminRoutes/>}/>
        </Routes>
      </FormDialogProvider>
    </div>
  );
}

export default App;
