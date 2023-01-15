import "./Cat.css";

function Cat(props) {
  return (
    <div className="cat">
        <img className="kitten" alt="kitten" src={"https://placekitten.com/"+props.num+"/300"}></img>
        <p>This is {props.name}</p>
    </div>
  );
}

export default Cat;