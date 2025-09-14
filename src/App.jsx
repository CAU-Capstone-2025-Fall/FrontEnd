import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import MainPage from './pages/MainPage';
import SubPage from './pages/SubPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/sub" element={<SubPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
