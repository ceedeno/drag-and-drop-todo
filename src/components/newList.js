import Form from "react-bootstrap/Form";
import {Button} from "react-bootstrap";
import React from "react";

function NewList(props) {
    return (
        <Form onSubmit={(event) => {
            props.onNewList(event);
            event.preventDefault()
        }}>
            <Form.Group controlId="name">
                <Form.Control required type="text" placeholder="Name"/>
            </Form.Group>
            <Button variant="success" type="submit">
                Create List
            </Button>
        </Form>
    )

}

export default NewList;