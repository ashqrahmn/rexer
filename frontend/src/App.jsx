import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Home from './components/Home';
import LandingPage from './components/LandingPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<LandingPage />}/>
        <Route path="/home" exact element={<Home />}/>
        <Route path="/login" exact element={<Login />}/>
        <Route path="/signup" exact element={<SignUp />}/>
      </Routes>
    </Router>
  )
}

export default App