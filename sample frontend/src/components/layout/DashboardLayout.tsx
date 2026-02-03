import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useFormDialogSafe } from '@/contexts/FormDialogContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { formOpen } = useFormDialogSafe();

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      {!formOpen && <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
      
      <div className={`flex flex-1 flex-col min-w-0 ${formOpen ? '' : 'lg:ml-64'}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
