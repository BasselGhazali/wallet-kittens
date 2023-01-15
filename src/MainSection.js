import "./MainSection.css";
import Cat from "./Cat.js";
import Card from "./Card.js";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import kittenABI from "./kittens.json";
import toDoABI from "./toDo.json";

function MainSection() {

  const [kittenScore, setKittenScore] = useState(0);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [chainID, setChainID] = useState(null);
  const [chainName, setChainName] = useState(null);
  const [balance, setBalance] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);

  const[kittenName, setKittenName] = useState("");
  const[userInput, setUserInput] = useState("");

  const[userTask, setUserTask] = useState("");
  const[tasks, setTasks] = useState([]);

  
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
    const smartContract = new ethers.Contract("0x0254e3dae148C43027Ce4a50Be007400D68CD7b9",kittenABI,signer);

    const whatIsName = await smartContract.kittenName();
    setKittenName(whatIsName.toString());

  }

  const writeToSmartContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const smartContract = new ethers.Contract("0x0254e3dae148C43027Ce4a50Be007400D68CD7b9",kittenABI,signer);
    const newName = await smartContract.changeName(userInput);
    const receipt = await newName.wait();
    console.log("Name changed on blockchain, transaction info: ", receipt);
  }

  const createTask = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const smartContract = new ethers.Contract("0x03A0ABAF80715a8A1B91c6baA9774AD821B1DBFD",toDoABI,signer);
    const newTask = await smartContract.createTask(userTask);
    const receipt = await newTask.wait();
    console.log("Task created, transaction info: ", receipt)
  }

  const updateTasks = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const smartContract = new ethers.Contract("0x03A0ABAF80715a8A1B91c6baA9774AD821B1DBFD",toDoABI,signer);
    const totalTasks = await smartContract.totalTasks();
    
    setTasks([]);
    for(var i=0; i<totalTasks; i++){
      const tasks = await smartContract.taskList(i);
      setTasks(prevTasks => [...prevTasks, tasks]);
    }
  }

  window.ethereum.on('chainChanged', chainChanged);
  window.ethereum.on('accountsChanged', chainChanged);

  useEffect(() => {
    getWalletAddress();
    updateTasks();
  }, []);

  return (
    <div className="mainsection">
        <div className="content">
          <div className="introduction">
            <p>This webpage is a WIP, being developed by <a href="https://github.com/BasselGhazali">Bassel Ghazali</a> to learn how to build an app using ReactJS which can connect to the blockchain.</p>
            <p>When you open the page, you will be asked to connect your MetaMask wallet. When you do this, your public information will be displayed here.</p>
            <p>New functions will continue to be added to this repo. The cats may vanish, but none of them will be harmed.</p>
          </div>
          <br></br>
          <div className="walletconnect">
            <p><strong>This data is being read through the MetaMask wallet you connect</strong></p>
            <p> Chain Name: { chainName }</p>
            <p> Chain ID: { chainID }</p>
            <p> Block Number: { blockNumber }</p>
            <p> Wallet: { currentAccount }</p>
            <p> Balance: { balance }</p>
          </div>
          <br></br>
          <div className="kittenscore">
            <p><strong> This score is just a state variable in React because I like the cats and don't want them to be irrelevant </strong></p>
            <p>Kitten score: { kittenScore }</p>
            <button onClick={ decreaseScore }> Take catnip </button>
            <button onClick={ increaseScore }> Give catnip </button>
          </div>
          <div className="blockchainreader">
            <p><strong> This variable is on a smart contract I deployed on the Goerli testnet </strong></p>
            <p>Kitten name on blockchain: { kittenName } </p>
            <button onClick={ readFromSmartContract }> Read name from blockchain </button>
            <br></br>
            <input value={ userInput } onChange={ inputName => setUserInput(inputName.target.value) } />
            <button onClick={ writeToSmartContract }> Write name to blockchain </button>
          </div>
          <div className="todo">
            <p><strong> This is another smart contract I deployed, which allows you to create tasks then mark them as done </strong></p>
            <input value={ userTask } onChange={ inputTaskName => setUserTask(inputTaskName.target.value) } />
            <button onClick={ createTask }> Create task </button>
            {
              tasks.map((item) => (
                <Card key={item.id} id={item.id} name={item.taskName} done={item.isCompleted} timedone={item.completionTime}></Card>
              ))
            }
          </div>
        </div>
        <div className="sidebar">
          <p>These cats do nothing but judge you silently.</p>
          <Cat name="Bambi" num="301"/>
          <Cat name="Ali" num="302"/>
          <Cat name="Basil" num="303"/>
        </div>
    </div>
  );
}

export default MainSection;