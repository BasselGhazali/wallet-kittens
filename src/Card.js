import "./Card.css";

function Card(props) {

    function isDone() {
        if (props.done === true){
            return <input type="checkbox" checked/>;
        }
        else {
            return <input type="checkbox"/>;
        }
    }

    return (
        <div className="ToDoItem">
            <p> { props.Name } </p>
            { isDone() }
        </div>
    );
}

export default Card;