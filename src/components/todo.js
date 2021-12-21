import React, {useState} from "react";
import {Draggable} from "react-beautiful-dnd";
import {Button} from "react-bootstrap";
import Collapse from "react-bootstrap/Collapse";

function Todo({onDone, title, description, id, index}) {
    const [open, setOpen] = useState(false);

    return (
        <Draggable draggableId={id.toString()} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}>
                    <div className="todo-container" onClick={() => setOpen(!open)}>
                        <div>
                            {title}
                        </div>
                        <Button className={"done-btn"} variant="success" onClick={onDone}>Done</Button>
                    </div>
                    <Collapse in={open}>
                        <div className="text-muted ">
                            {description}
                        </div>
                    </Collapse>
                </div>
            )}
        </Draggable>
    )
}

export default Todo;