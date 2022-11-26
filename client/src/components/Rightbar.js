import { Input } from '@web3uikit/core';
import { Search } from '@web3uikit/icons';
import React from 'react';
import hardhat from '../images/hardhat.jpg';
import metamask from '../images/metamask.jpg';
import react from '../images/react.png';
import solidity from '../images/solidity.jpg';
import './Rightbar.css';
const Rightbar = () => {
    const trends = [
        {
            img:hardhat,
            text: "Learn how to use hardhat dev tool",
            link: "#"
        },
        {
            img:react,
            text: "Learn how to use react dev tool",
            link: "#"
        },
        {
            img:metamask,
            text: "Learn how to use metamask dev tool",
            link: "#"
        },
        {
            img:solidity,
            text: "Learn how to use solidity dev tool",
            link: "#"
        }
    ]
    return (
        <>
           <div className="rightbarContent">
            <Input label='Search Twitter' name='Search Twitter' prefixIcon={<Search />} labelBgColor="#141d26"></Input>
            <div className="trends">
                Trending
                {
                    trends.map((e)=>{
                        return(
                            <>
                                <div className="trend">
                                    <img src={e.img} alt="image" className='trendImg' />
                                    <div className="trendText">{e.text}</div>
                                </div>
                            </>
                        )
                    })
                }
            </div>
          </div> 
        </>
    );
};

export default Rightbar;