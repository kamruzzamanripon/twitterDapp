import { Input, Loading, Upload, useNotification } from '@web3uikit/core';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { Web3Storage } from 'web3.storage';
import Web3Modal from 'web3modal';
import TwitterAbi from '../abi/Twitter.json';
import { TwitterContractAddress, Web3StorageApi } from '../config';
import './Settings.css';


const Settings = () => {

   const notification = useNotification();
   const userName = JSON.parse(localStorage.getItem('userName'));
   const userBio = JSON.parse(localStorage.getItem('userBio'));
   const userImage = JSON.parse(localStorage.getItem('userImage'));
   const userBanner = JSON.parse(localStorage.getItem('userBanner'));

   const [profileFile, setProfileFile] = useState();
   const [bannerFile, setBannerFile] = useState();
   const [name, setName] = useState();
   const [bio, setBio] = useState();
   const [loading, setLoading] = useState(false);
   let profileUploadedUrl = userImage;
   let bannerUploadUrl = userBanner;

   async function storeFile(selectedFile){
      const client = new Web3Storage({token: Web3StorageApi});
      const rootCid = await client.put(selectedFile);
      //let ipfsUploadedUrl = `https://${rootCid}.ipfs.dweb.link/${selectedFile[0].name}`;
      let ipfsUploadedUrl = `https://${rootCid}.ipfs.w3s.link/${selectedFile[0].name}`
      return ipfsUploadedUrl;
   }

   const bannerHandler = (event)=>{
      if(event != null){
         setBannerFile(event)
      }
   }

   const profileHandler = (event)=>{
      if(event != null){
         setProfileFile(event)
      }
   }

   useEffect(()=>{

   },[]);

   async function updateProfile(){
      setLoading(true);
      if(profileFile != null){
         let newProfileUploadedUrl = await storeFile([profileFile]);
         profileUploadedUrl = newProfileUploadedUrl;
      }

      if(bannerFile != null){
         let newBannerUploadedUrl = await storeFile([bannerFile]);
         bannerUploadUrl = newBannerUploadedUrl;
      }

      const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(TwitterContractAddress, TwitterAbi.abi, signer);
        const transaction = await contract.updateUser(name, bio, profileUploadedUrl, bannerUploadUrl);
        await transaction.wait();

        window.localStorage.setItem('userName', JSON.stringify(name));
        window.localStorage.setItem('userBio', JSON.stringify(bio));
        window.localStorage.setItem('userImage', JSON.stringify(profileUploadedUrl));
        window.localStorage.setItem('userBanner', JSON.stringify(bannerUploadUrl));

        notification({
         type: 'success',
         title: 'Profile Updated Successfully',
         position: 'topR'
        })

        setLoading(false)
   }

    return (
        <>
         <div className="settingsPage">
            <Input label="Name" name="NameChange" width="100%" labelBgColor='#141d26' onChange={(e)=>setName(e.target.value)} value={userName} />
            <Input label="Bio" name="BioChange" width="100%" labelBgColor='#141d26' onChange={(e)=>setBio(e.target.value)} value={userBio} />
            <div className="pfp">Change Profile Image</div>
            <Upload onChange={profileHandler} />
            <div className="pfp">change Banner Image</div>
            <Upload onChange={bannerHandler} />
            {
               loading ?
               <div className='save'> <Loading /> </div> :
               <div className="save" onClick={updateProfile}>Save</div>
            }
            
         </div>
        </>
    );
};

export default Settings;