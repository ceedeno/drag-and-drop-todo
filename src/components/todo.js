import React, {useState} from "react";
import {Draggable} from "react-beautiful-dnd";
import Collapse from "react-bootstrap/Collapse";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faAngleUp, faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";

function Todo({onDone, title, description, id, index}) {
    const [open, setOpen] = useState(false);
    const [checked, setChecked] = useState(false)

    const handleChecked = () => {
        setChecked(true);
        setOpen(false);
    };

    return (
        <Draggable draggableId={id.toString()} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}>
                    <div className="todo-container">
                        {!checked && <>
                            <div className={"d-flex justify-content-between w-100"}>
                                <div>
                                    &nbsp;{title}
                                </div>
                                <button className={"border-0 btn-transition btn btn-outline-secondary"} onClick={() => setOpen(!open)}>
                                    {!open ?
                                        <FontAwesomeIcon icon={faAngleDown}/> :
                                        <FontAwesomeIcon icon={faAngleUp}/>}
                                </button>
                            </div>
                            <button className={"border-0 btn-transition btn btn-outline-success"}
                                    onClick={handleChecked}>
                                <FontAwesomeIcon icon={faCheck}/>
                            </button>
                        </>}
                        {checked && <>
                            <div style={{color: 'grey'}}>
                                <s>&nbsp;{title}</s>
                            </div>
                            <button className={"border-0 btn-transition btn btn-outline-danger"} onClick={onDone}>
                                <FontAwesomeIcon icon={faTimes}/>
                            </button>
                        </>}
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