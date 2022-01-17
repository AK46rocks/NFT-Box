import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import './App.css';
import myEpicNft from "./utils/KadakNFT.json"


const App = () => {

  const { ethereum } = window;
  const contractAddress = "0x939bacff5c3f65ed0a9251e50d9685be19ec4000";  
  const [currentAccount, setCurrentAccount] = useState("");

  const isWalletConnected = async() => {
    try {
          
          if(!ethereum){
            console.log("Please connect through Metamask !!");

          }
          else{
            console.log("Ethereum Object:",ethereum);
          }

          const accounts = await ethereum.request({ method : "eth_accounts"})
          
          if(accounts.length !== 0){
            const account = await accounts[0];
            console.log('Account Address:',account);
            setCurrentAccount(account);
          }else{
            console.log("NO Authorised Account found");
          }

          setupEventListener();
    } catch (error) {
      console.log(error);
    }
  }


  const connectWallet = async() =>{
      try {
        if(!ethereum){
          console.log("get Eth");
        
        }else{
          const accounts = await ethereum.request({method : "eth_requestAccounts" });
          setCurrentAccount(accounts[0]);
          console.log("Current Account:", currentAccount);
          setupEventListener();
        }

      } catch (error) {
        console.log(error);
      }
  }

  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(contractAddress, myEpicNft.abi, signer);

        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewKadakNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          console.log(`Here's the link: https://testnets.opensea.io/assets/${contractAddress}/${tokenId.toNumber()}`)
        
          //View on Open-Sea           
          document.getElementById('opensea').href=`https://testnets.opensea.io/assets/${contractAddress}/${tokenId.toNumber()}`;
          document.getElementById('opensea').innerHTML = "View your NFT on Opensea";
        
          //View on Rarible
          document.getElementById('rarible').href=`https://rinkeby.rarible.com/token/${contractAddress}:${tokenId.toNumber()}`;
          document.getElementById('rarible').innerHTML = "View your NFT on Rarible";
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const mintNFT = async() => {
    try {
      let chainId = await ethereum.request({ method:"eth_chainId"});
      console.log("ChainID: ",chainId);
      let rinkebyChainId = "0x4";

      if (chainId == rinkebyChainId) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, myEpicNft.abi , signer);
  
      let nftTxn = await nftContract.makeAnKadakNFT();
      console.log("Mining....");
      document.getElementById("process").innerHTML = "Mining Your NFT..";

      await nftTxn.wait();
      console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      document.getElementById("process").innerHTML = "Awesome, Your NFT is Mined !";
      

      }else{
        console.log("Please Connect to Rinkeby Test Network !!");
        alert("Please Connect to Rinkeby Test Network !!");
      }

    } catch (error) {
      console.log(error);
    }
  } 

  useEffect(() => {
    isWalletConnected();
  }, [])

  
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Random Free NFT</p>
          <p className="sub-text">
            Each unique. Each simple. Discover your FREE NFT today.
          </p>

          {currentAccount && (
             <button onClick={mintNFT} className="cta-button mint-button"
             >
             Mint NFT
             </button>
            )
          }

          {!currentAccount && (
            <button className="cta-button connect-wallet-button" onClick={connectWallet}>
            Connect to Wallet
            </button>
           )
          }

          <div>
            <h3 style={{color:"violet"}} id='process'></h3>
            
            <div style={{marginTop:'100px'}}>

             <p className="sub-text" style={{color:'gray'}}>
               Note: After NFT is mined it will take around a minute to show
             </p> 
             <p className="sub-text" >
               View NFT :
             </p> 
              
              <br></br>
              <a id='opensea' href='' style={{color:'skyblue'}} target="_blank"></a>
              <br></br>
              <br></br>
              <a id='rarible' href='' style={{color:'greenyellow'}} target="_blank"></a>
            </div>
          </div>         
          

        </div>
         <div className="footer-container">
          
          <p style={{color:"gray"}}>By AK46ROCKS</p>
        </div>
      </div>
    </div>
  );
};

export default App;