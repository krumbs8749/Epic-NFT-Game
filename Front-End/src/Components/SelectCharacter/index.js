import React, {useState, useEffect} from 'react';
import './SelectCharacter.css';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';
import { ethers } from 'ethers';
import LoadingIndicator from '../LoadingIndicator';


const SelectCharacter = ({setCharacterNFT }) =>{
  
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);
  const [mintingCharacter, setMintingCharacter] = useState(false);

  const mintCharacterNFTAction = (characterId) => async () => {
    try{
      if(gameContract){
        setMintingCharacter(true);
        console.log('Minting character in progress...');
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log('mintTxn:', mintTxn);
        setMintingCharacter(true);


      }
    }catch(error){
      setMintingCharacter(false);
      console.warn('MintCharacterAction Error:', error)
    }
  }

  useEffect(()=> {
    const {ethereum} = window;
    if(ethereum){
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicGame.abi, signer);

      setGameContract(gameContract);
    }else {
    console.log('Ethereum object not found');
    }
  },[]);

  useEffect(()=>{
    const getCharacters = async () =>{
      try{
        console.log('Getting contract characters to mint');

        const characterTxn = await gameContract.getAllDefaultCharacters();
        console.log("Characterstxn: ", characterTxn);

        const characters = characterTxn.map((characterData) => 
          transformCharacterData(characterData)
        )
        setCharacters(characters);
      }catch(error){
        console.log('Something went wrong fetching characters:', error);
      }
    };
    const onCharacterMint  = async(sender, tokenId, characterIndex) => {
      console.log(
        `Character Minted - sender: ${sender} tokenId: ${tokenId} character: ${characterIndex.toNumber()}`
      );

      if(gameContract){
        const characterNft = await gameContract.checkIfUserHasNFT();
        console.log('CharacterNft: ', characterNft);
        setCharacterNFT(transformCharacterData(characterNft));
      }

    };

    if(gameContract){
      getCharacters();


      gameContract.on('CharacterNFTMinted', onCharacterMint);
    }

    return () => {
      if(gameContract){
        gameContract.off('CharacterNFTMinted', onCharacterMint);
      }
      
    }

  },[gameContract]);

  const renderCharacters = () => 
    characters.map((character, index) => (
      <div className="character-item" key={character.name}>
        <div className="name-container">
          <p>{character.name}</p>
        </div>
        <img src={`https://cloudflare-ipfs.com/ipfs/${character.imageURI}`} alt={character.name} />
        <button
          type="button"
          className="character-mint-button"
          onClick={mintCharacterNFTAction(index)}
        >
        {`Mint ${character.name}`}
        </button>
      </div>
    ))

  return (
    <div className="select-character-container">
      <h2>Mint Your Hero. Choose wisely.</h2>
      {characters.length > 0 && 
      (<div className="character-grid">{renderCharacters()}</div>)
      }
      {mintingCharacter && (
      <div className="loading">
        <div className="indicator">
          <LoadingIndicator />
          <p>Minting In Progress...</p>
        </div>
        <img
          src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
          alt="Minting loading indicator"
        />
      </div>
    )}
      
    </div>
  );
};

export default SelectCharacter;