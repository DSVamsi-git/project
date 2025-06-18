import { useState, useEffect } from 'react'; 
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Profile from './Profile';
import axios from 'axios'; 

const server_URI = import.meta.env.VITE_SERVER_URI;

function ToEnter() {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios.get(`${server_URI}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(() => setIsValid(true))
      .catch(() => setIsValid(false))
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setIsValid(false);
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  return isValid ? <Profile /> : <Login />;
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ToEnter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
