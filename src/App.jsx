import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AnimalSearch from './pages/AnimalSearch';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AnimalSearch />} />
      </Routes>
    </Router>
  );
};

export default App;
