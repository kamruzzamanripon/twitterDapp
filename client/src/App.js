import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Rightbar from './components/Rightbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';


function App() {
  return (
    <>
     <div className="page">
        <div className="sideBar"> <Sidebar /> </div>
        <div className="mainWindow">
            <Routes>
              <Route path='/' element={<Home />} />  
              <Route path='/profile' element={<Profile />} />  
              <Route path='/settings' element={<Settings />} />  
            </Routes>  
        </div> 
        <div className="rightBar"> <Rightbar /> </div>
     </div> 
    </>
  );
}

export default App;
