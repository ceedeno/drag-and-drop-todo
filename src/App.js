import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import './App.css';
import {Button, Card, Container} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
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

function NewTodo(props) {
    return (
        <div>
            <Form onSubmit={(event) => {
                props.onNewTodo(event);
                event.preventDefault()
            }}>
                <Form.Group controlId="title">
                    <Form.Control required type="text" placeholder="Title"/>
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Control required as="textarea" placeholder="Description"/>
                </Form.Group>
                <Button variant="success" type="submit">
                    Add To do
                </Button>
            </Form>
        </div>
    )
}

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


//////////////////////////////////CONTEXTS/////////////////////////////////////////////////////////////
const AppContext = createContext();

///////////////////////////////////////////////////////////////////////////////////////////////////////

function genList(name, id = Math.random().toString()) {
    const todos = []
    return ({name, id, todos})
}

function App() {
    const [lists, setLists] = useState([]);
    const [addListClicked, setAddListClicked] = useState(false);

    useEffect(() => {
        console.log(lists)
    }, [lists]);

    const handleRemoveList = useCallback((id) => {
        setLists(lists.filter((list) => list.id !== id))
    }, [lists, setLists]);

    const handleNewList = useCallback((event) => {
        setLists([...lists, genList(event.target[0].value)]);
        setAddListClicked(false);
    }, [lists, setLists, setAddListClicked]);

    const onDragEnd = useCallback((result) => {
        if(!result.destination){
            return;
        }

        if(result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index){
            return;
        }

        let sourceListIndex = 0
        let destinationListIndex = 0
        //Extracting the droppable element index: source and destination list index in lists Array
        lists.map((list, index) => {
            if (list.id === result.source.droppableId) {
                sourceListIndex = index
            }
            return list
        })
        lists.map((list, index) => {
            if (list.id === result.destination.droppableId) {
                destinationListIndex = index
            }
            return list
        })

        //Removing todoMoved
        const [newTodo] = lists[sourceListIndex].todos.filter((todo) => todo.id === result.draggableId)
        const newList1 = {
            ...lists[sourceListIndex],
            todos: lists[sourceListIndex].todos.filter((todo) => todo.id !== newTodo.id)
        }
        const newListsState = lists.filter((list) => list.id !== lists[sourceListIndex].id)
        const lastLists = [...newListsState.slice(0, sourceListIndex), newList1, ...newListsState.slice(sourceListIndex)]

        //Inserting todoMoved
        const newList2 = {
            ...lastLists[destinationListIndex],
            todos: [...lastLists[destinationListIndex].todos.slice(0, result.destination.index), newTodo, ...lastLists[destinationListIndex].todos.slice(result.destination.index)]
        }
        const newListsState2 = lastLists.filter((list) => list.id !== lists[destinationListIndex].id)

        //Setting State
        setLists([...newListsState2.slice(0, destinationListIndex), newList2, ...newListsState2.slice(destinationListIndex)])

    }, [lists, setLists])


    return (
        <AppContext.Provider value={[lists, setLists]}>
            <Container id={"lists-container"}>
                <DragDropContext onDragEnd={onDragEnd}>
                    {
                        lists.map(({id, name, todos}, index) => (
                            <TodoList
                                onRemoveList={() => handleRemoveList(id)}
                                name={name}
                                MyListId={id}
                                myIndex={index}
                                todos={todos}
                                key={id}
                            />

                        ))
                    }
                    {!addListClicked &&
                    <div className={"div-btn"}>
                        <Button
                            variant="success"
                            onClick={() => setAddListClicked(true)}
                        >Add List</Button>
                    </div>}
                    {addListClicked && <NewList onNewList={handleNewList}/>}
                </DragDropContext>
            </Container>
        </AppContext.Provider>
    )
}

export default App;