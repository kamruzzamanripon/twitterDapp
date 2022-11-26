import { Avatar } from '@web3uikit/core';
import { Matic, MessageCircle, Star } from '@web3uikit/icons';
import React from 'react';
import { defaultImgs } from '../defaultImgs';
import './TweetInFeed.css';

const TweetInFeed = ({profile}) => {
    return (
        <>
            <div className="feedTweet">
                <Avatar isRounded image={defaultImgs[0]} theme="image" size={60} />
                <div className="completeTweet">
                    <div className="who">
                        Elon Musk
                        <div className="accWhen">0x5454465454165445845644</div>
                    </div>
                    <div className="tweetContent">
                        Nice day learning web3 fromscratch
                        <img src={defaultImgs[1]} className="tweetImg" />
                    </div>
                    <div className="interactions">
                        <div className="interactionNums"><MessageCircle fontSize={20} /></div>
                        <div className="interactionNums"><Star fontSize={20} /></div>
                        <div className="interactionNums"><Matic fontSize={20} /></div>
                    </div>
                </div>
            </div>   
        </>
    );
};

export default TweetInFeed;