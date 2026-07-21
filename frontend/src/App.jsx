import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BootSequence from './components/boot/BootSequence';
import Cursor from './components/cursor/Cursor';
import ProtectedRoute from "./page/ProtectedRoute";
import NotFound from './page/front/NotFound';

// Public Router
import Home from './page/front/Home';
import ProjectPage from './page/front/ProjectPage';
import Contact from './page/front/Contact';
import PublicProjectDetail from './page/front/PublicProjectDetail';
import PublicLayout from './components/layout/PublicLayout';
import Journey from './page/front/Journey';

// Admin Router
import Login from "./page/front/Login";
import AdminLayout from './page/admin/AdminLayout';
import AdminHome from './page/admin/AdminHome';
import ProjectList from './page/admin/ProjectList';
import ProjectForm from './page/admin/ProjectForm';
import MilestoneForm from './page/admin/milestone/MilestoneForm';
import MilestoneList from './page/admin/milestone/MilestoneList';

function App() {
  const [booted, setBooted] = useState(() => sessionStorage.getItem('booted') === 'true');

  const handleBootComplete = () => {
    sessionStorage.setItem('booted', 'true');
    setBooted(true);
  };

  return (
    <>
      { !booted && <BootSequence onComplete={handleBootComplete} />}
      <Cursor />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/project" element={<PublicLayout><ProjectPage /></PublicLayout>} />
          <Route path="/project/:slug" element={<PublicLayout><PublicProjectDetail /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/journey" element={<PublicLayout><Journey /></PublicLayout>} />

          {/* Admin */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute> <AdminLayout /> </ProtectedRoute>}>
            <Route index element={<AdminHome />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/:id/edit" element={<ProjectForm />} />
            <Route path="milestones" element={<MilestoneList />} />
            <Route path="milestones/new" element={<MilestoneForm />} />
          </Route>
          <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;