import { Button } from '@web3uikit/core';
import { Metamask, Twitter } from '@web3uikit/icons';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Rightbar from './components/Rightbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      {isAuthenticated ? (
        <div className="page">
          <div className="sideBar">
            {" "}
            <Sidebar />{" "}
          </div>
          <div className="mainWindow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
          <div className="rightBar">
            {" "}
            <Rightbar />{" "}
          </div>
        </div>
      ) : (
        <div className="loginPage">
          <Twitter fill='#ffffff' fontSize={80} />
          <Button onClick={null} size="xl" text='login with Metamask' theme='primary' icon={<Metamask />} />
        </div>
      )}
    </>
  );
}

export default App;
