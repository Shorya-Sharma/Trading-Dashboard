import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ROUTES } from './config/routes';
import Notification from './components/Notification';

function App() {
  return (
    <Router>
      <Routes>
        {Object.values(ROUTES).map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.element />}
          />
        ))}
      </Routes>
      <Notification />
    </Router>
  );
}

export default App;
