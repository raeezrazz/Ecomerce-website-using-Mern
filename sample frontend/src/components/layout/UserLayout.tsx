import { Navbar } from '@/components/user/Navbar';
import { Footer } from '@/components/user/Footer';
import { Outlet } from 'react-router-dom';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout = ()=> {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet/>
      </main>
      <Footer />
    </div>
  );
}

export default UserLayout