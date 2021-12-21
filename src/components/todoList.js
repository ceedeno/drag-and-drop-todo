import React, {useCallback, useContext, useEffect, useState} from "react";
import {Button, Card} from "react-bootstrap";
import {Droppable} from "react-beautiful-dnd";
import ListGroup from "react-bootstrap/ListGroup";
import Todo from "./todo";
import NewTodo from "./newTodo";
import AppContext from "../context/appContext";

function genTodo(title, description, id = Math.random().toString()) {
    return ({title, description, id})
}

function TodoList({onRemoveList, name, MyListId, myIndex, todos}) {
    const [addClicked, setAddClicked] = useState(false);
    const [lists, setLists] = useContext(AppContext)

    useEffect(() => {
        console.log(todos)
    }, [todos]);

    const handleDone = useCallback((id) => {
        const newList = {
            ...lists[myIndex],
            todos: lists[myIndex].todos.filter((todo) => todo.id !== id)
        }
        const newListsState = lists.filter((list) => list.id !== lists[myIndex].id)
        setLists([...newListsState.slice(0, myIndex), newList, ...newListsState.slice(myIndex)])
    }, [setLists, myIndex, lists]);


    // other solution (event) => {event.target[0].value, event.target[1].value}
    //////////////////////////// add call back to father(title, description, index)
    const handleNewTodo = useCallback(({target: [title, description]}) => {
        const newList = {
            ...lists[myIndex],
            todos: [...lists[myIndex].todos, genTodo(title.value, description.value)]
        }
        const newListsState = lists.filter((list) => list.id !== lists[myIndex].id)
        setLists([...newListsState.slice(0, myIndex), newList, ...newListsState.slice(myIndex)])
        setAddClicked(false);
    }, [lists, setLists, setAddClicked, myIndex]);

    return (
        <Card>
            <Card.Header id={"flex-card-todolist-header"}>{name}
                <Button variant="danger" onClick={onRemoveList}>Remove</Button>
            </Card.Header>
            <Card.Body>
                <Droppable droppableId={MyListId.toString()}>
                    {(provided) => (
                        <ListGroup
                            variant="flush"
                            ref={provided.innerRef}
                            {...provided.droppableProps}>
                            {
                                todos.map(({title, description, id}, index) => (<Todo
                                    onDone={() => handleDone(id)}
                                    title={title}
                                    description={description}
                                    id={id}
                                    index={index}
                                    key={id}
                                />))
                            }
                            {provided.placeholder}
                        </ListGroup>
                    )}
                </Droppable>
                {!addClicked && <Button variant="success" onClick={() => setAddClicked(true)}>Add To Do</Button>}
                {addClicked && <NewTodo onNewTodo={handleNewTodo}/>}
            </Card.Body>
        </Card>
    );
}

export default TodoList;