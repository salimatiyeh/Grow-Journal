import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import GrowDetailPage from './pages/GrowDetailPage.jsx';
import GrowListPage from './pages/GrowListPage.jsx';
import GrowNewPage from './pages/GrowNewPage.jsx';
import DailyEntryNewPage from './pages/DailyEntryNewPage.jsx';
import PlantNewPage from './pages/PlantNewPage.jsx';
import PlantShowPage from './pages/PlantShowPage.jsx';
import './App.css';

function Header() {
  const location = useLocation();
  const path = location.pathname;

  let title = 'Grows';
  if (path.startsWith('/grows/new')) {
    title = 'New Grow';
  } else if (path.startsWith('/grows/') && path !== '/grows') {
    title = 'Grow Details';
  }

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <Link to="/grows" className="brand">
            Grow Journal
          </Link>
          <span className="divider" aria-hidden="true">
            /
          </span>
          <span className="header-title">{title}</span>
        </div>
        <nav>
          <Link to="/grows" className="nav-link">
            All grows
          </Link>
        </nav>
      </div>
    </header>
  );
}

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/grows" replace />} />
          <Route path="/grows" element={<GrowListPage />} />
          <Route path="/grows/new" element={<GrowNewPage />} />
          <Route path="/grows/:growId" element={<GrowDetailPage />} />
          <Route path="/grows/:growId/plants/new" element={<PlantNewPage />} />
          <Route
            path="/grows/:growId/plants/:plantId"
            element={<PlantShowPage />}
          />
          <Route
            path="/grows/:growId/daily-entry/new"
            element={<DailyEntryNewPage />}
          />
          <Route path="*" element={<Navigate to="/grows" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
