import { Routes, Route } from 'react-router-dom';
import Hero from './pages/Hero';
import AuthSuccess from './pages/AuthSuccess';
import AuthFailure from './pages/AuthFailure';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/auth/success" element={<AuthSuccess />} />
      <Route path="/auth/failure" element={<AuthFailure />} />
    </Routes>
  );
}

export default App;