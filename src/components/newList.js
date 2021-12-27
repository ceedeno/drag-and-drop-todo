import Form from "react-bootstrap/Form";
import {Button} from "react-bootstrap";
import React from "react";

function NewList(props) {
    return (
        <div className={"new-list-container"}>
            <Form onSubmit={(event) => {
                props.onNewList(event);
                event.preventDefault()
            }}>
                <Form.Group controlId="name">
                    <Form.Control required type="text" placeholder="Name"/>
                </Form.Group>
                <div className={"new-todo-btn-div"}>
                    <Button variant="success" type="submit">
                        Create List
                    </Button>
                    <Button variant="outline-secondary" onClick={() => props.AddListClicked(false)}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </div>
    )

}

export default NewList;