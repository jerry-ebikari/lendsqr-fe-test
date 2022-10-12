import React from 'react';
import './App.scss';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Users from './pages/Users';
import Placeholder from './pages/Placeholder';
import User from './pages/User';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}>
          <Route path='' element={<Users />} />
          <Route path='users' element={<Users />} />
          <Route path='user/:id' element={<User />}/>
          <Route path='*' element={<Placeholder />} />
        </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
