import { Button, Loading, useNotification } from '@web3uikit/core';
import { Metamask, Twitter } from '@web3uikit/icons';
import { ethers, utils } from 'ethers';
import React, { useEffect, useState } from 'react';
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
      const contract = new ethers.Contract(TwitterContractAddress, TwitterAbi.abi, signer);
      const getUserDetail = await contract.getUser(signerAddress);

      if(getUserDetail['profileImg']){
        //if user exists
        window.localStorage.setItem("activeAccount", JSON.stringify(signerAddress));
        window.localStorage.setItem("userName", JSON.stringify(getUserDetail['name']));
        window.localStorage.setItem("userBio", JSON.stringify(getUserDetail['bio']));
        window.localStorage.setItem("userImage", JSON.stringify(getUserDetail['profileImg']));
        window.localStorage.setItem("userBanner", JSON.stringify(getUserDetail['profileBanner']));
       
      }else{
        //First Time user
        //Get a Random avatar and update in the contract
        setLoadingState(true);
        let avatar = toonavatar.generate_avatar();
        let defaultBanner = "https://images.pexels.com/photos/10610221/pexels-photo-10610221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
        window.localStorage.setItem("activeAccount", JSON.stringify(signerAddress));
        window.localStorage.setItem("userName", JSON.stringify(''));
        window.localStorage.setItem("userBio", JSON.stringify(''));
        window.localStorage.setItem("userImage", JSON.stringify(avatar));
        window.localStorage.setItem("userBanner", JSON.stringify(defaultBanner));

        try{
          const transaction = await contract.updateUser('', '', avatar, defaultBanner)
          await transaction.wait();
        }catch(error){
          console.log("ERROR", error);
          notification({
            type:'warinng',
            message: 'Get Test Matic From Polygon faucet',
            title: 'Require minium 0.1 MATIC',
            position: 'topR'
          })
          setLoadingState(false);
          return;
        }
      }

      setProvider(provider);
      setIsAuthenticated(true)

    }
  }




  useEffect(()=>{
    if(!provider){
      window.alert("No metamask Installed");
      window.location.replace("https://metamask.io");
    }

    connectWallet()

    const handleAccountsChanged = (accounts)=>{
      if(provider.chainId == "0x13881" ){  //MATIC chainId 
        infoNotification(accounts[0]);
      } 

      //just to prevent reloading twice for the very first time
      if(JSON.parse(localStorage.getItem('activeAccount')) != null){
        setTimeout(()=>{window.location.reload()}, 3000);
      }
    }

    const handleChainChanged = (chainId)=>{
      if(provider.chainId == "0x13881" ){  //MATIC chainId 
        warningNotification();
      } 
      window.location.reload();
    }

    const handleDisconnect = ()=>{}

    provider.on("accountsChanged", handleAccountsChanged);
    provider.on("chainChanged", handleChainChanged);
    provider.on("disconnect", handleDisconnect);
  },[])

  return (
    <>
      {isAuthenticated ? (
        <div className="page">
          <div className="sideBar">
            <Sidebar />
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
            <Rightbar />
          </div>
        </div>
      ) : (
        <div className="loginPage">
          <Twitter fill='#ffffff' fontSize={80} />
          {
          loading ?
          <Loading size={50} spinnerColor="green" /> :
          <Button onClick={null} size="xl" text='login with Metamask' theme='primary' icon={<Metamask />} />
          }
         
        </div>
      )}
    </>
  );
}

export default App;
