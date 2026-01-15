import ProfileSettingsPage from "../pages/ProfileSettingsPage.jsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CommunityPage from "./pages/CommunityPage.jsx";
import MyHeroSpace from "./components/MyHeroSpace.jsx";
import HeroJournal from "./components/HeroJournal.jsx";
import HomePage from "./pages/HomePage.jsx";
import Nav from "./components/Nav.jsx";

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfileSettingsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/hero-space" element={<MyHeroSpace />} />
        <Route path="/hero-journal" element={<HeroJournal />} />
      </Routes>
    </Router>
  );
}

export default App;