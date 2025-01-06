import { useEffect, useState } from 'react';
import Create from './Create';
import axios from 'axios';
import './App.css';
import { BsCircleFill, BsFillTrashFill, BsFillCheckCircleFill } from 'react-icons/bs';

function Home() {
    const [todos, setTodos] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/get')
            .then(result => setTodos(result.data))
            .catch(err => console.log(err));
    }, []);

    const handleEdit = (id) => {
        setCurrentTaskId(id);
        setShowDialog(true); 
    };

    const confirmEdit = () => {
        axios.put(`http://localhost:3001/update/${currentTaskId}`)
            .then(() => {
                setShowDialog(false);
                setCurrentTaskId(null);
                location.reload();
            })
            .catch(err => console.log(err));
    };

    const handleDeleteClick = (id) => {
        setTaskToDelete(id);  
        setShowDeleteModal(true);  
      };
    
      
      const handleDelete = () => {
        if (taskToDelete) {
          axios.delete('http://localhost:3001/delete/' + taskToDelete)
            .then(result => {
              location.reload();
            })
            .catch(err => console.log(err));
        }
        setShowDeleteModal(false);  
      };
    
      
      const handleCloseDeleteModal = () => {
        setShowDeleteModal(false); 
      };

    const sortedTodos = [...todos].sort((a, b) => a.done - b.done); 


    return (
        <div className='home'>
            <h2>Todo List</h2>
            <Create />
            {
                sortedTodos.length === 0
                    ?
                    <div><h2>No records</h2></div>
                    :
                    sortedTodos.map(todo => (
                        
                        <div className={`task ${todo.done ? "taskdone-container" : "done-container"}`}>
                            
                            <div className='checkbox' onClick={() => handleEdit(todo._id)}>
                                {todo.done ? 
                                <BsFillCheckCircleFill className='icon'></BsFillCheckCircleFill>
                                : <BsCircleFill className='icon'/>
                                }
                                
                                
                                <p className={todo.done ? "taskdone": "done"}>{todo.task}</p>
                            </div>
                            <div>
                                <span><BsFillTrashFill className='icon' 
                                 onClick={() => handleDeleteClick(todo._id)}/></span>
                            </div>
                        </div>
                    ))
            }
            {showDialog && (
                <div className="dialog-overlay">
                    <div className="dialog-box">
                        <p><b>Before marking "Done", please make sure that you have completed the task.</b></p>
                        <div className="dialog-actions">
                            <button onClick={() => setShowDialog(false)}>I haven't completed the task</button>
                            <button onClick={confirmEdit}>I've completed the task</button>
                        </div>
                    </div>
                </div>
            )}
            {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Are you sure you want to delete this task?</h2>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={handleCloseDeleteModal}>Cancel</button>
              <button className="confirm-btn" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
        </div>
    );
    
}


export default Home;
