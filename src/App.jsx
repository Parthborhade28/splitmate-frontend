import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TripDetails from "./pages/TripDetails";
import Profile from "./pages/Profile";
import History from "./pages/History";

function App(){
  return(
    <HashRouter>
      <Routes>

        {/* 🔥 DEFAULT ROUTE */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/trip/:id" element={<TripDetails/>}/>
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<History />} />

        {/* 🔥 FALLBACK */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </HashRouter>
  );
}

export default App;