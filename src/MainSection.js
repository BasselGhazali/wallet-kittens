import "./MainSection.css";
import Cat from './Cat.js';
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ABI from "./smartContract.json";

function MainSection() {

  const [kittenScore, setKittenScore] = useState(0);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [chainID, setChainID] = useState(null);
  const [chainName, setChainName] = useState(null);
  const [balance, setBalance] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);

  const[kittenName, setKittenName] = useState(null);
  const[userInput, setUserInput] = useState(null);

  
  function increaseScore() {
    setKittenScore(kittenScore+1);
  }

  function decreaseScore() {
    setKittenScore(kittenScore-1);
  }

  const getWalletAddress = async() => {
      if(window.ethereum && window.ethereum.isMetaMask){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts");
        const currentAddress = await provider.getSigner().getAddress();
        setCurrentAccount(currentAddress);

        const chain = await provider.getNetwork();
        setChainID(chain.chainId);
        setChainName(chain.name);

        const amount = await provider.getBalance(currentAddress);
        const amountEth = ethers.utils.formatEther(amount);
        setBalance(amountEth);

        const block = await provider.getBlockNumber();
        setBlockNumber(block);
      }
  }

  const chainChanged = () => {
      window.location.reload();
  }

  const readFromSmartContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const smartContract = new ethers.Contract("0x0254e3dae148C43027Ce4a50Be007400D68CD7b9",ABI,signer);

    const whatIsName = await smartContract.kittenName();
    setKittenName(whatIsName.toString());

  }

  const writeToSmartContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const smartContract = new ethers.Contract("0x0254e3dae148C43027Ce4a50Be007400D68CD7b9",ABI,signer);
    const newName = await smartContract.changeName(userInput);
    const receipt = await newName.wait();
    console.log("Name changed on blockchain, transaction info: ", receipt);
  }

  window.ethereum.on('chainChanged', chainChanged);
  window.ethereum.on('accountsChanged', chainChanged);

  useEffect(() => {
    getWalletAddress();
  }, []);

  return (
    <div class="mainsection">
        <div class="content">
          <div class="introduction">
            <p>This webpage is a WIP, being developed by <a href="https://github.com/BasselGhazali">Bassel Ghazali</a> to learn how to build an app using ReactJS which can connect to the blockchain.</p>
            <p>When you open the page, you will be asked to connect your MetaMask wallet. When you do this, your public information will be displayed here.</p>
            <p>New functions will continue to be added to this repo. The cats may vanish, but none of them will be harmed.</p>
          </div>
          <br></br>
          <div class="walletconnect">
            <p><strong>This data is being read through the MetaMask wallet you connect</strong></p>
            <p> Chain Name: { chainName }</p>
            <p> Chain ID: { chainID }</p>
            <p> Block Number: { blockNumber }</p>
            <p> Wallet: { currentAccount }</p>
            <p> Balance: { balance }</p>
          </div>
          <br></br>
          <div class="kittenscore">
            <p><strong> This score is just a state variable in React because I like the cats and don't want them to be irrelevant </strong></p>
            <p>Kitten score: { kittenScore }</p>
            <button onClick={ decreaseScore }> Take catnip </button>
            <button onClick={ increaseScore }> Give catnip </button>
          </div>
          <div class="blockchainreader">
            <p><strong> This variable is on a smart contract I deployed on the Goerli testnet </strong></p>
            <p>Kitten name on blockchain: { kittenName } </p>
            <button onClick={ readFromSmartContract }> Read name from blockchain </button>
            <br></br>
            <input value={ userInput } onInput={ inputName => setUserInput(inputName.target.value) } />
            <button onClick={ writeToSmartContract }> Write name to blockchain </button>
          </div>
        </div>
        <div class="sidebar">
          <p>These cats do nothing but judge you silently.</p>
          <Cat name="Ahmed" num="300"/>
          <Cat name="Ali" num="301"/>
          <Cat name="Basil" num="302"/>
        </div>
    </div>
  );
}

export default MainSection;