import "./MainSection.css";
import Cat from './Cat.js';
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ABI from "./HoldDataSimple.json";

function MainSection() {

  const [kittenScore, setKittenScore] = useState(0);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [chainID, setChainID] = useState(null);
  const [chainName, setChainName] = useState(null);
  const [balance, setBalance] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);

  const[foodStatus, setFoodStatus] = useState(null);
  const[blockchainScore, setBlockchainScore] = useState(null);
  const[kittenName, setKittenName] = useState(null);

  const[kittenExcitement, setKittenExcitement] = useState(null);
  const[kittenCounter, setKittenCounter] = useState(null);
  
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

  const readHoldData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    // const chosenContract = new ethers.Contract("0x7074471A3aF8Cabf7B766DDCFbb6E273A962ba2A",ABI,signer);
    const chosenContract = new ethers.Contract("0xfAa16Ca238f08358F6439CE5CB03300874C483A6",ABI,signer);

    const isKittenFed = await chosenContract.kittenFed();
    setFoodStatus(isKittenFed.toString());

    const whatIsName = await chosenContract.kittenName();
    setKittenName(whatIsName.toString());

    const getBlockchainScore = await chosenContract.kittenScore();
    setBlockchainScore(getBlockchainScore.toString());
    
    const addedScore = await chosenContract.addScore();
    setKittenCounter(addedScore.toString());

    const excitedName = await chosenContract.exciteName();
    setKittenExcitement(excitedName.toString());

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
            <p> Chain Name: { chainName }</p>
            <p> Chain ID: { chainID }</p>
            <p> Block Number: { blockNumber }</p>
            <p> Wallet: { currentAccount }</p>
            <p> Balance: { balance }</p>
          </div>
          <br></br>
          <div class="kittenscore">
            <p>Kitten score: { kittenScore }</p>
            <button onClick={ decreaseScore }> Take catnip </button>
            <button onClick={ increaseScore }> Give catnip </button>
          </div>
          <div class="blockchainreader">
            <button onClick={ readHoldData }> Read from blockchain </button>
            <p>Kitten name: { kittenName } </p>
            <p>Kitten fed: { foodStatus } </p>
            <p>Kitten score on blockchain: { blockchainScore } </p>
            <p>Kitten score after addition: { kittenCounter } </p>
            <p>Kitten name after excitement: { kittenExcitement } </p>
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