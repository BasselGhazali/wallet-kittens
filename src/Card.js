import "./Card.css";
import { useState } from "react";
import { ethers } from "ethers";
import toDoABI from "./toDo.json";

function Card(props) {

    const [checked, setChecked] = useState(props.done);
    const [timeDisplay, setTimeDisplay] = useState(renderTime(props.timedone));

    const toggleTask = async() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const smartContract = new ethers.Contract("0x03A0ABAF80715a8A1B91c6baA9774AD821B1DBFD",toDoABI,signer);
        
        const toggle = await smartContract.toggleTask(props.id);
        const receipt = await toggle.wait();
        
        if (receipt.confirmations > 0) {

            setChecked(!checked);
            
            const task = await smartContract.taskList(props.id);
            const newTime = renderTime(task.completionTime.toNumber());
            setTimeDisplay(newTime);
        }
    }


    function convertTime(timestamp){
        var a = new Date(timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = "0" + a.getMinutes();
        var sec = "0" + a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min.substr(-2) + ':' + sec.substr(-2);
        return time;
    }

    function renderTime(timeToRender) {
        if(timeToRender > 0){
            timeToRender = convertTime(timeToRender);
            return "Completed on: ".concat(timeToRender);
        }
        else {
            return "";
        }
    }

    return (
        <div className="ToDoItem">
            <p><strong> { props.name } </strong></p>
            <input onClick={ toggleTask } type="checkbox" checked={ checked } readOnly/>
            <p> { timeDisplay } </p>
        </div>
    );
}

export default Card;