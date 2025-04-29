import { Outlet } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';

const StudentDashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <StudentSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentDashboardLayout;