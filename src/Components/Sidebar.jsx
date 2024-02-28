import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { useNavigate } from "react-router-dom";

const Sidebar = () => {

    const navigate = useNavigate();

    const Home = () => {
        navigate('/');
    }

    const Large = () => {
        navigate('/L');
    }

    const Medium = () => {
        navigate('/M');
    }

    const Small = () => {
        navigate('/S');
    }

    return(
        <div className=" bg-light text-dark">
            <ListGroup className="list-group list-group-flush p-3 mb-2 bg-light text-dark">
                
                <ListGroupItem className="list-group-item p-3 mb-2 text-dark" eventKey={"Home"}
                                    action onClick={Home}>Home</ListGroupItem>
                    
                <ListGroupItem className="list-group-item p-3 mb-2 text-dark" eventKey={"Large"}
                                action onClick={Large}>International</ListGroupItem>
                
                <ListGroupItem className="list-group-item p-3 mb-2 text-dark" eventKey={"Medium"}
                                action onClick={Medium}>Regional</ListGroupItem>
                
                <ListGroupItem className="list-group-item p-3 mb-2 text-dark" eventKey={"Small"}
                                action onClick={Small}>Local</ListGroupItem>
            </ListGroup>
        </div>
    )
}

export default Sidebar;