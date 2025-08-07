import { Routes, Route } from 'react-router-dom';
import Hero from './pages/Hero';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
    </Routes>
  );
}

export default App;