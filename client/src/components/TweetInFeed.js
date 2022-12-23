import { Avatar, Loading, useNotification } from '@web3uikit/core';
import { Bin, Matic, MessageCircle, Star } from '@web3uikit/icons';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import Twitter from '../abi/Twitter.json';
import { TwitterContractAddress } from '../config';
import './TweetInFeed.css';


const TweetInFeed = (props) => {
    const onlyUser = props.profile;
    let reloadComponent = props.reload;
    const [tweets, setTweets] = useState([]);
    const [loadingState, setLoadingState] = useState('not-loaded');
    const notification = useNotification();
    console.log("only user tweets", tweets)
    useEffect(()=>{
        if(onlyUser){
            loadMyTweets();
        }else{
            loadAllTweets();
        }
    },[reloadComponent])

    async function loadMyTweets(){
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(TwitterContractAddress, Twitter.abi, signer);
        const data = await contract.getMyTweets();
        const userName = JSON.parse(localStorage.getItem('userName'));
        const userImage = JSON.parse(localStorage.getItem('userImage'));
        const result = await Promise.all(data.map(async tweet =>{
            const unixTime = tweet.timestamp;
            const date = new Date(unixTime * 1000);
            const tweetDate = date.toLocaleDateString("fr-CH");

            let item = {
                tweeter: tweet.tweeter,
                id: tweet.id,
                tweetText: tweet.tweetText,
                tweetImg: tweet.tweetImg,
                isDeleted: tweet.isDeleted,
                userName: userName,
                userImage: userImage,
                date: tweetDate
            }
            return item;
        }))

        setTweets(result.reverse());
        setLoadingState('loaded')
    }

    async function loadAllTweets(){
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(TwitterContractAddress, Twitter.abi, signer);
        const data = await contract.getAllTweets();
        const result = await Promise.all(data.map(async tweet =>{
            const unixTime = tweet.timestamp;
            const date = new Date(unixTime * 1000);
            const tweetDate = date.toLocaleDateString("fr-CH");
            let getUserDetail = await contract.getUser(tweet.tweeter)
            console.log("getUserDetail", getUserDetail['profileBanner']);
            let item = {
                tweeter: tweet.tweeter,
                id: tweet.id,
                tweetText: tweet.tweetText,
                tweetImg: tweet.tweetImg,
                isDeleted: tweet.isDeleted,
                userName: getUserDetail['name'],
                userImage: getUserDetail['profileImg'],
                date: tweetDate
            }
            return item;
        }))

        setTweets(result.reverse());
        setLoadingState('loaded')
    }

    async function deleteTweet(tweetId){
        setLoadingState('not-loaded');
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(TwitterContractAddress, Twitter.abi, signer);
        const data = await contract.deleteTweet(tweetId, true);
        await data.wait();
        notification({
            type: 'success', 
            title: 'Tweet Deleted Successfully',
            position: 'topR',
            icon: <Bin />
        });

        loadMyTweets();
    }


    if(loadingState == 'not-loaded'){
        return(
            <div className="loading">
                <Loading size={60} spinnerColor="#8247e5" />
            </div>
        )
    } 

    if(loadingState == 'loaded' && !tweets.length){
        return(
            <h1 className='loading'>No Tweet available</h1>
        )
    }

    return (
        <>
            {
                tweets.map((tweet, i)=>(
                    <div className="feedTweet" key={i}>
                        <Avatar isRounded image={tweet.userImage} theme="image" size={60} />
                        <div className="completeTweet">
                            <div className="who">
                                {tweet.userName}
                                <div className="accWhen">{tweet.tweeter}</div>
                            </div>
                            <div className="tweetContent">
                                {tweet.tweetText}
                                {tweet.tweetImg != '' && (
                                    <img src={tweet.tweetImg} className="tweetImg" />
                                )}
                                
                            </div>
                            <div className="interactions">
                                <div className="interactionNums"><MessageCircle fontSize={20} />0</div>
                                <div className="interactionNums"><Star fontSize={20} /> {tweet.date} </div>
                                { onlyUser ? 
                                <div className='interactionNums'> <Bin fontSize={20} color="#ff0000" onClick={()=>deleteTweet(tweet.id)} /> </div> : 
                                <div className="interactionNums"><Matic fontSize={20} /></div>}
                                
                            </div>
                        </div>
                    </div> 
                ))
            }  
        </>
    );
};

export default TweetInFeed;