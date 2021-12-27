import Form from "react-bootstrap/Form";
import {Button} from "react-bootstrap";
import React from "react";

function NewTodo(props) {
    return (
        <div>
            <Form onSubmit={(event) => {
                props.onNewTodo(event);
                event.preventDefault()
            }}>
                <Form.Group controlId="title" className={"input-field"}>
                    <Form.Control required type="text" placeholder="Title"/>
                </Form.Group>
                <Form.Group controlId="description" className={"input-field"}>
                    <Form.Control required as="textarea" placeholder="Description"/>
                </Form.Group>
                <div className={"new-todo-btn-div"}>
                    <Button variant="success" type="submit">
                        Add To do
                    </Button>
                    <Button variant="outline-secondary" onClick={() => props.AddClicked(false)}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default NewTodo;