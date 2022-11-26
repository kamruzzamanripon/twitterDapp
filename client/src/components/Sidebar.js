import { Cog, Cube, Twitter, User } from '@web3uikit/icons';
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <>
         <div className="siderContent">
            <div className="menu">
                <div className="details"> <Twitter fontSize="50px" /> </div>

                <Link to="/" className='link'>
                    <div className="menuItems">
                        <Cube fontSize="50px" /> Home
                    </div>
                </Link>

                <Link to="/profile" className='link'>
                    <div className="menuItems">
                        <User fontSize="50px" /> Profile
                    </div>
                </Link>

                <Link to="/settings" className='link'>
                    <div className="menuItems">
                        <Cog fontSize="50px" /> Settings
                    </div>
                </Link>  
            </div>   
         </div>   
        </>
    );
};

export default Sidebar;