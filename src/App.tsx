import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ToastContainer from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';
import Home from './pages/Home';
import Children from './pages/Children';
import Records from './pages/Records';
import RewardShop from './pages/RewardShop';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/children" element={<Children />} />
            <Route path="/records" element={<Records />} />
            <Route path="/rewards" element={<RewardShop />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <BottomNav />
        <ToastContainer />
        <ConfirmDialog />
      </div>
    </BrowserRouter>
  );
}

export default App;
