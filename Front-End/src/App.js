import React, {useEffect, useState} from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import SelectCharacter from './Components/SelectCharacter';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import myEpicGame from './utils/MyEpicGame.json';
import { ethers } from 'ethers';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';


// Constants
const TWITTER_HANDLE = 'krumbs8749';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App =  () => {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentNft, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkIfWalletIsConnected =async () =>{
    try {
      const {ethereum} = window;
      if(!ethereum){
        console.log('Make sure you have MetaMask!');
        
        setIsLoading(false);
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
      }

      const accounts = await ethereum.request({method: 'eth_accounts' });

      if(accounts.length !== 0){
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
      } else {
        console.log('No authorized account found');
      }
      
      setIsLoading(false);  
    }catch(error){
      console.log(error);
    }

  }
  const renderContent = () =>{

    if(isLoading){
      return <LoadingIndicator />;
    }
    
    if(!currentAccount){
      return(
        <div className="connect-wallet-container">
            <img
              src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
              alt="Monty Python Gif"
            />
            <button
              className="cta-button connect-wallet-button"
              onClick={connectWalletAction}
            >
              Connect Wallet To Get Started
            </button>
          </div>
      )
    }
    else if(currentAccount && !currentNft){
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    }
    else{
      return <Arena characterNFT = {currentNft} setCharacterNFT={setCharacterNFT} />;
      //return <SelectCharacter setCharacterNFT={setCharacterNFT} />;

    }
  }

  const connectWalletAction = async () => {
    try{

      const{ethereum} = window;

    if (!ethereum) {
      alert('Get MetaMask!');
      return;
    }

    const accounts = await ethereum.request({method: 'eth_requestAccounts'});

    console.log("Connected to wallet: ", accounts[0]);
    setCurrentAccount(accounts[0]);

    }catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, [])

  useEffect(() => {

    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicGame.abi, signer);

      const txn = await gameContract.checkIfUserHasNFT();
      if(txn.name){
        console.log('User has character NFT');
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log('No character NFT found');
      }
    };

    if (currentAccount) {
        console.log('CurrentAccount:', currentAccount);
        fetchNFTMetadata();
    };
  }, [currentAccount])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
