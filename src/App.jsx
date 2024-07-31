// src/App.jsx
import React, { useState } from "react";
import PomodoroTimer from "./components/PomodoroTimer";
import TaskManager from "./components/TaskManager";
import NotesContainer from "./components/NotesContainer";
import "./index.css";

const App = () => {
  const [isWorkSession, setIsWorkSession] = useState(true);

  const handleSessionChange = (isWork) => {
    setIsWorkSession(isWork);
  };
  return (
    <div
      className={`min-h-screen text-white transition-colors duration-1000 ${
        isWorkSession
          ? "bg-gradient-to-r from-teal-500 to-teal-900"
          : "bg-gradient-to-r from-blue-400 to-blue-500"
      }`}
    >
      <PomodoroTimer onSessionChange={handleSessionChange} />
      <div className="grid grid-cols-1 lg:grid-cols-3 mt-4 ">
        <div className="lg:col-span-2">
          <TaskManager />
        </div>
        <div className="lg:col-span-1">
          <NotesContainer />
        </div>
      </div>
    </div>
  );
};

export default App;
