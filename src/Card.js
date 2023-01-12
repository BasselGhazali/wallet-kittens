import "./Card.css";
import { useState } from "react";
import { ethers } from "ethers";
import toDoABI from "./toDo.json";

function Card(props) {

    const [checked, setChecked] = useState(props.done);

    const toggleTask = async() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const smartContract = new ethers.Contract("0x03A0ABAF80715a8A1B91c6baA9774AD821B1DBFD",toDoABI,signer);
        
        const toggleContract = await smartContract.toggleTask(props.id);
        const receipt = await toggleContract.wait();
        if (receipt.confirmations > 0) {
            setChecked(!checked);
            console.log("Task id " + props.id + "has been toggled from " + !checked + " to " + checked + ". transaction information:" + receipt);
        }
    }
    
    return (
        <div className="ToDoItem">
            <p> { props.Name } </p>
            <input onClick={ toggleTask } type="checkbox" checked={ checked }/>
        </div>
    );
}

export default Card;