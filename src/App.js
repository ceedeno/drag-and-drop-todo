import React, {useCallback, useEffect, useState} from 'react';
import './App.css';
import {Button, Container} from "react-bootstrap";
import {DragDropContext} from "react-beautiful-dnd";
import AppContext from "./context/appContext";
import TodoList from "./components/todoList";
import NewList from "./components/newList";
import {genList} from "./utils/generators";
import listsDemo from "./constants/demo";


function App() {
    const [lists, setLists] = useState(listsDemo);
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
        if (!result.destination) {
            return;
        }

        if (result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index) {
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
                            <div className={"add-list-btn"}>
                                <Button
                                        variant="success"
                                        onClick={() => setAddListClicked(true)}
                                >Add List</Button>
                            </div>
                        </div>}
                    {addListClicked && <NewList onNewList={handleNewList} AddListClicked={setAddListClicked}/>}
                </DragDropContext>
            </Container>
        </AppContext.Provider>
    )
}

export default App;