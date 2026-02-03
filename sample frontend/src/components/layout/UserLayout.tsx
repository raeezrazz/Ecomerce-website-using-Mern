import { Navbar } from '@/components/user/Navbar';
import { Footer } from '@/components/user/Footer';
import { Outlet } from 'react-router-dom';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout = ()=> {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet/>
      </main>
      <Footer />
    </div>
  );
}

export default UserLayout