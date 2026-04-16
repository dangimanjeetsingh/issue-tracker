import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";

function App() {
  return (
    <div>
      {/* Navbar is shown on all pages. */}
      <Navbar />

      <main className="page-container">
        {/* Routes decide which page component should be shown. */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

