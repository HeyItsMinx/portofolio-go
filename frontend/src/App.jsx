import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProjectList from './page/admin/ProjectList';
import ProjectForm from './page/admin/ProjectForm';
import PublicProjectList from './page/front/PublicProjectList'
import PublicProjectDetail from './page/front/PublicProjectDetail'
import Login from "./page/front/Login";
import ProtectedRoute from "./page/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectList />} />
        <Route path="/project" element={<PublicProjectList />} />
        <Route path="/project/:slug" element={<PublicProjectDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><ProjectList /></ProtectedRoute>} />
        <Route path="/admin/form" element={<ProtectedRoute><ProjectForm /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;