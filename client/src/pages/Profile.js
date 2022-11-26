import React from 'react';
import { Link } from 'react-router-dom';
import TweetInFeed from '../components/TweetInFeed';
import { defaultImgs } from '../defaultImgs.js';
import './Profile.css';

const Profile = () => {
    return (
        <>
         <img src={defaultImgs[1]} className="profileBanner" />
         <div className="pfpContainer">
            <img src={defaultImgs[0]}  className="profilePFP" />
            <div className="profileName">Rahul Agarwal</div>
            <div className="profileWallet">0x4545454545415454</div>
            <Link to='/settings'>
               <div className="profileEdit">Edit Profile</div>
            </Link>
            <div className="profileBio">A middle class web3 developer</div>
            <div className="profileTabs">
               <div className="profileTab">Your Tweets</div>
            </div>
         </div>
         <TweetInFeed profile={true}></TweetInFeed>
        </>
    );
};

export default Profile;