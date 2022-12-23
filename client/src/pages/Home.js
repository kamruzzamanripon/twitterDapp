import { Avatar, Loading, useNotification } from '@web3uikit/core';
import { Image } from '@web3uikit/icons';
import { ethers } from 'ethers';
import React, { useRef, useState } from 'react';
import { Web3Storage } from 'web3.storage';
import Web3Modal from 'web3modal';
import TwitterAbi from '../abi/Twitter.json';
import TweetInFeed from '../components/TweetInFeed.js';
import { TwitterContractAddress, Web3StorageApi } from '../config';
import './Home.css';

const Home = () => {
   const inputFile = useRef(null);
   const [selectedImage, setSelectedImage] = useState('');
   const [tweetText, setTweetText] = useState('');
   const userImage = JSON.parse(localStorage.getItem('userImage'));
   const [selectedFile, setSelectedFile] = useState();
   const [uploading, setUploading] = useState(false);
   let ipfsUploadedUrl = '';
   const nofification = useNotification();
   
   async function storeFile(){
      const client = new Web3Storage({token: Web3StorageApi});
      const rootCid = await client.put(selectedFile);
      //ipfsUploadedUrl = `https://${rootCid}.ipfs.dweb.link/${selectedFile[0].name}`
      ipfsUploadedUrl = `https://${rootCid}.ipfs.w3s.link/${selectedFile[0].name}`
   }

   const onImageClick = ()=>{
     inputFile.current.click()
   }

   const changeHandler = (event)=>{
      const imgFile = event.target.files[0];
      setSelectedImage(URL.createObjectURL(imgFile));
      setSelectedFile(event.target.files)
   }

   async function addTweet(){
      if(tweetText.trim().length < 5){
         nofification({
            type: 'warning',
            message: 'minium 5 characters',
            title: 'Tweet Field reqired',
            position: 'topR'
         })
         return;
      }

      setUploading(true);
      if(selectedImage){
         await storeFile();
      }

      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(TwitterContractAddress, TwitterAbi.abi, signer);
      const tweetValue = "0.01";
      const price = ethers.utils.parseEther(tweetValue);

      try{
         const transaction = await contract.addTweet(tweetText, ipfsUploadedUrl, {value: price});
         await transaction.wait();
         nofification({
            type:'success', 
            title: 'Tweet Added Successfully',
            position: 'topR'
         })

         setSelectedImage(null);
         setTweetText('');
         setSelectedFile(null);
         setUploading(false);
      }catch(error){
         Notification({
            type: 'error',
            title: 'Transaction Error',
            message: error.message,
            position: 'topR'
         });
         setUploading(false);
      }

   }
   

    return (
        <>
            <div className="mainContent">
               {/* Tweet text and image upload field */}
               <div className="profileTweet">
                  <div className="tweetSection">
                     <Avatar isRounded image={userImage} theme="image" size={60} />
                     <textarea 
                        name="TweetTxtArea" 
                        placeholder="What's going on?" 
                        className='textArea'
                        onChange={(e)=> setTweetText(e.target.value)}
                        value={tweetText}
                     ></textarea>
                  </div>

                  <div className="tweetSection">
                     <div className="imgDiv" onClick={onImageClick}>
                        <input 
                           type="file" 
                           ref={inputFile}
                           onChange={changeHandler}
                           style={{ display:"none" }}
                        />
                        { selectedImage ? <img src={selectedImage} width={50} /> : <Image fontSize={25} fill="#ffffff" /> }
                        
                     </div>
                     <div className="tweet" onClick={addTweet}> {uploading ? <Loading /> : 'Tweet'} </div>
                  </div>   
               </div>
               {/* End Tweet text and image upload field */}

               {/* Feed Section */}
               <TweetInFeed profile={false} reload={uploading} />

            </div>
        </>
    );
};

export default Home;