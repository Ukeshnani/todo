import { useEffect, useState } from 'react';
import Create from './Create';
import axios from 'axios';
import './App.css';
import { BsCircleFill, BsFillTrashFill, BsFillCheckCircleFill } from 'react-icons/bs';

function Home() {
    const [todos, setTodos] = useState([]);
    const [deletedTodos, setDeletedTodos] = useState([]);
    const [showDeleted, setShowDeleted] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogType, setDialogType] = useState(""); // "done" or "delete"
    const [currentTask, setCurrentTask] = useState(null);

    // Fetch tasks on mount
    useEffect(() => {
        axios.get('http://localhost:3001/get')
            .then(result => setTodos(result.data))
            .catch(err => console.log(err));
    }, []);

    // Handle marking a task as done
    const handleMarkDone = (id) => {
        const todoToUpdate = todos.find(todo => todo._id === id);
        const updatedTodos = todos.map(todo =>
            todo._id === id ? { ...todo, done: !todo.done } : todo
        );
        setTodos(updatedTodos);

        axios.put('http://localhost:3001/update/' + id, { done: !todoToUpdate.done })
            .catch(err => console.log(err));
    };

    // Handle deleting a task
    const handleDelete = (id) => {
        const todoToDelete = todos.find(todo => todo._id === id);
        setDeletedTodos((prevDeleted) => [...prevDeleted, todoToDelete]);
        setTodos((prevTodos) => prevTodos.filter(todo => todo._id !== id));

        axios.delete('http://localhost:3001/delete/' + id).catch(err => console.log(err));
    };

    // Open dialog
    const openDialog = (type, task) => {
        setShowDialog(true);
        setDialogType(type);
        setCurrentTask(task);
    };

    // Close dialog
    const closeDialog = () => {
        setShowDialog(false);
        setDialogType("");
        setCurrentTask(null);
    };

    // Confirm dialog action
    const confirmDialogAction = () => {
        if (dialogType === "done" && currentTask) {
            handleMarkDone(currentTask._id);
        } else if (dialogType === "delete" && currentTask) {
            handleDelete(currentTask._id);
        }
        closeDialog();
    };

    return (
        <div className='home'>
            <h2>Todo List</h2>
            <div className="todo-header">
            <Create />
            <div className='space'>
            <button className="show-deleted-btn" onClick={() => setShowDeleted(!showDeleted)}>
                {showDeleted ? "Hide Deleted Tasks" : "Show Deleted Tasks"}
            </button>
            </div>
            </div>

            {/* Show Deleted Tasks */}
            {showDeleted && (
                <div className='deleted-tasks'>
                    <h3>Deleted Tasks</h3>
                    {deletedTodos.length === 0 ? (
                        <p>No deleted tasks.</p>
                    ) : (
                        deletedTodos.map(todo => (
                            <div className='task deleted-task' key={todo._id}>
                                <p>{todo.task}</p>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Task List */}
            {!showDeleted && (
                <div>
                    {todos.length === 0 ? (
                        <div><h2>No records</h2></div>
                    ) : (
                        [...todos].sort((a, b) => a.done - b.done).map(todo => (
                            <div className={`task ${todo.done ? "taskdone-container" : "done-container"}`} key={todo._id}>
                                <div className='checkbox' onClick={() => openDialog("done", todo)}>
                                    {todo.done ?
                                        <BsFillCheckCircleFill className='icon' /> :
                                        <BsCircleFill className='icon' />
                                    }
                                    <p className={todo.done ? "taskdone" : "done"}>{todo.task}</p>
                                </div>
                                <div>
                                    <span>
                                        <BsFillTrashFill className='icon' onClick={() => openDialog("delete", todo)} />
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Confirmation Dialog */}
            {showDialog && (
                <div className="dialog-overlay">
                    <div className="dialog-box">
                        <p>
                            {dialogType === "delete"
                                ? `Are you sure you want to delete this task?`
                                : `Before marking this task as done, please make sure you have completed it. Are you sure?`}
                        </p>
                        <div className="dialog-actions">
                            <button className="cancel-btn" onClick={closeDialog}>Cancel</button>
                            <button className="confirm-btn" onClick={confirmDialogAction}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
