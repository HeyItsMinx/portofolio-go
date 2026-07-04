import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProjectList from './ProjectList';
import ProjectForm from './ProjectForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectList />} />
        <Route path="/form" element={<ProjectForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;