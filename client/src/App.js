import { Button, useNotification } from '@web3uikit/core';
import { Metamask, Twitter } from '@web3uikit/icons';
import { ethers, utils } from 'ethers';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Web3Modal from 'web3modal';
import TwitterAbi from './abi/Twitter.json';
import './App.css';
import Rightbar from './components/Rightbar';
import Sidebar from './components/Sidebar';
import { TwitterContractAddress } from './config.js';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
var toonavatar = require('cartoon-avatar');


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [provider, setProvider] = useState(window.ethereum);
  const notification = useNotification();
  const [loading, setLoadingState] = useState(false);

  const warningNotification = ()=>{
    notification({
      type: 'waring',
      message: 'Change network to polygon to visit this site', 
      title: "Switch to polygon Network",
      position: 'topR'
    })
  }

  const infoNotification = (accountNum)=>{
    notification({
      type: 'info',
      message: accountNum,
      title: 'Connected to Polygon Account',
      position: 'topR'
    })
  }

  const connectWallet = async ()=>{
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    let provider = new ethers.providers.Web3Provider(connection);
    const getnetwork = await provider.getNetwork();
    const polygonChainId = 80001;
    if(getnetwork.chainId != polygonChainId){
      warningNotification();

      try{
        await provider.provider.request({
          method: "wallet_switchEthereumChain",
          params: [{chainI: utils.hexValue(polygonChainId)}]
        })
        .then(()=>window.location.reload());
      }catch(swithError){
        //This error code indicates that the chain has not been added to metamask
        //so will add polygon network to their metamask
        if(swithError.code === 4902){
          try{
            await provider.provider.request({
              method: "wallet_addEthereumChain",
              params:[
                {
                  chainId: utils.hexValue(polygonChainId),
                  chainName: "Polygon Testnet",
                  rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
                  blockExplorerUrls: ["https://mumbai.polygonscan.com"],
                  nativeCurrency: {
                    Symbol: "MATIC",
                    decimals: 18
                  }
                }
              ]
            }).then(()=>window.location.reload())
          }catch(addError){
            throw addError;
          }
        }
      }
    }else{
      //It will execute if polygon chain is connected
      //here we will verify if user exists or not in our blockchanin or else we will update user details in our contract as well as locla storage.
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      const contact = new ethers.Contract(TwitterContractAddress, TwitterAbi.abi, signer);
      const getUserDetail = await contact.getUser(signerAddress);

      if(getUserDetail['profileImage']){
        //if user exists
      }else{
        //First Time user
        //Get a Random avatar and update in the contract
      }

      setProvider(provider);
      setIsAuthenticated(true)

    }
  }
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
