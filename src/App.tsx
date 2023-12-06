// In your routing setup (could be in a separate file)
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/:q" element={<Home/>} />
      <Route path="/" element={<Home/>} />
    </Routes>
  );
};

export default App;
