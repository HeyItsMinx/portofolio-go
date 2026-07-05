import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './page/front/Home';
import ProjectList from './page/admin/ProjectList';
import ProjectForm from './page/admin/ProjectForm';
import ProjectPage from './page/front/ProjectPage';
import Contact from './page/front/Contact';
import PublicProjectDetail from './page/front/PublicProjectDetail';
import Login from "./page/front/Login";
import ProtectedRoute from "./page/ProtectedRoute";
import PublicLayout from './components/layout/PublicLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/project" element={<PublicLayout><ProjectPage /></PublicLayout>} />
        <Route path="/project/:slug" element={<PublicLayout><PublicProjectDetail /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><ProjectList /></ProtectedRoute>} />
        <Route path="/admin/form" element={<ProtectedRoute><ProjectForm /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;