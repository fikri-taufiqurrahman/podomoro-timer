import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaPlus, FaTrash } from "react-icons/fa";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [finishedTasks, setFinishedTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    // Load tasks from local storage when the component mounts
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const storedFinishedTasks =
      JSON.parse(localStorage.getItem("finishedTasks")) || [];
    setTasks(storedTasks);
    setFinishedTasks(storedFinishedTasks);
  }, []);

  const saveTasksToLocalStorage = (tasks, finishedTasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("finishedTasks", JSON.stringify(finishedTasks));
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    let updatedTasks = Array.from(tasks);
    let updatedFinishedTasks = Array.from(finishedTasks);

    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === "tasks") {
        const [removed] = updatedTasks.splice(source.index, 1);
        updatedTasks.splice(destination.index, 0, removed);
        setTasks(updatedTasks);
      } else {
        const [removed] = updatedFinishedTasks.splice(source.index, 1);
        updatedFinishedTasks.splice(destination.index, 0, removed);
        setFinishedTasks(updatedFinishedTasks);
      }
    } else {
      if (source.droppableId === "tasks") {
        const [removed] = updatedTasks.splice(source.index, 1);
        updatedFinishedTasks.splice(destination.index, 0, removed);
        setTasks(updatedTasks);
        setFinishedTasks(updatedFinishedTasks);
      } else {
        const [removed] = updatedFinishedTasks.splice(source.index, 1);
        updatedTasks.splice(destination.index, 0, removed);
        setTasks(updatedTasks);
        setFinishedTasks(updatedFinishedTasks);
      }
    }

    saveTasksToLocalStorage(updatedTasks, updatedFinishedTasks);
  };

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      const newTaskObj = { id: `task-${tasks.length + 1}`, content: newTask };
      const updatedTasks = [...tasks, newTaskObj];
      setTasks(updatedTasks);
      setNewTask("");
      saveTasksToLocalStorage(updatedTasks, finishedTasks);
    }
  };

  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    const updatedFinishedTasks = finishedTasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    setFinishedTasks(updatedFinishedTasks);
    saveTasksToLocalStorage(updatedTasks, updatedFinishedTasks);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              className="tasks p-4 border rounded"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <h2 className="text-xl font-bold mb-4">Tasks</h2>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="p-2 border rounded bg-inherit text-white flex-1 placeholder-white"
                  placeholder="New task"
                />

                <button
                  onClick={handleAddTask}
                  className="px-4 py-2 bg-inherit text-white rounded hover:border-b-2 transition-colors duration-300 flex items-center"
                >
                  <FaPlus className="mr-2" /> Add Task
                </button>
              </div>
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      className="p-2 mb-2 bg-inherit border-b-2 rounded flex justify-between items-center"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {task.content}
                      <button
                        className="ml-4 text-white hover:text-white transition-colors duration-300"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Droppable droppableId="finishedTasks">
          {(provided) => (
            <div
              className="finished-tasks p-4 border rounded"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <h2 className="text-xl font-bold mb-4">Finished Tasks</h2>
              {finishedTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      className="task p-2 mb-2 bg-inherit border-b-2 rounded flex justify-between items-center"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {task.content}
                      <button
                        className="ml-4 text-white hover:text-white transition-colors duration-300"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default TaskManager;
