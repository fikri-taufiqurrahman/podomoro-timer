import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import {
  FaPlay,
  FaPause,
  FaClock,
  FaRegClock,
  FaHourglassHalf,
} from "react-icons/fa";

const PomodoroTimer = ({ onSessionChange }) => {
  const [time, setTime] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    work: 1500,
    break: 900,
  });
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeButton, setActiveButton] = useState("short");

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("Browser does not support desktop notifications");
    } else {
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") {
          alert("Notification permission is required for this feature.");
        }
      });
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => (time > 0 ? time - 1 : 0));
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    if (time === 0 && isActive) {
      clearInterval(interval);
      if (isWorkSession) {
        setTime(selectedOption.break);
        setIsWorkSession(false);
        onSessionChange(false); // Inform parent component of session change
        showNotification("Break Session Started", {
          body: "Time for a break! Enjoy your rest.",
          icon: "break_icon_url", // URL icon for break session
        });
      } else {
        setTime(selectedOption.work);
        setIsWorkSession(true);
        onSessionChange(true); // Inform parent component of session change
        showNotification("Focus Session Started", {
          body: "Back to work! Stay focused.",
          icon: "work_icon_url", // URL icon for focus session
        });
      }
    }
    return () => clearInterval(interval);
  }, [isActive, time, isWorkSession, selectedOption, onSessionChange]);

  useEffect(() => {
    document.title = isWorkSession
      ? `Focus Session (${formatTime(time)})`
      : `Break Session (${formatTime(time)})`;
  }, [isWorkSession, time]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  };

  const handleStartPause = () => {
    if (isActive) {
      setIsActive(false);
    } else {
      setIsModalVisible(true);
    }
  };

  const handleConfirmStart = () => {
    setIsModalVisible(false);
    setIsActive(true);
  };

  const handleTimeChange = (work, breakTime, buttonName) => {
    setSelectedOption({ work, break: breakTime });
    setTime(work);
    setIsWorkSession(true);
    setIsActive(false);
    setActiveButton(buttonName);
  };

  const showNotification = (title, options) => {
    if (Notification.permission === "granted") {
      const notification = new Notification(title, options);
      setTimeout(() => {
        notification.close();
      }, 5000); // Close notification after 5 seconds
    }
  };

  const calculateStrokeDashoffset = () => {
    const radius = 100; // Circle radius
    const circumference = 2 * Math.PI * radius;
    const progress =
      time / (isWorkSession ? selectedOption.work : selectedOption.break);
    return circumference - progress * circumference;
  };

  return (
    <div className="pomodoro-timer p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Pomodoro Timer</h1>
      <div className="timer-wrapper relative inline-block">
        <svg className="progress-ring" height="220" width="220">
          <circle
            className="progress-ring__circle"
            stroke="white"
            strokeWidth="8"
            fill="transparent"
            r="100"
            cx="110"
            cy="110"
            style={{
              strokeDashoffset: calculateStrokeDashoffset(),
              strokeDasharray: 2 * Math.PI * 100,
            }}
          />
        </svg>
        <div className="timer-display text-4xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {formatTime(time)}
        </div>
      </div>
      <div className="my-8 flex justify-center">
        <button
          onClick={handleStartPause}
          className="px-4 py-2 bg-inherit  rounded hover:border-b-2 transition-colors duration-300 mr-2 flex items-center"
        >
          {isActive ? <FaPause /> : <FaPlay />}
          <span className="ml-2">{isActive ? "Pause" : "Start"}</span>
        </button>
      </div>

      {!isActive && (
        <div className="my-2">
          <div className="flex justify-center">
            <button
              onClick={() => handleTimeChange(1500, 900, "short")}
              className={`px-4 py-2  rounded transition-colors  hover:border-b-2 duration-300 mr-2 flex items-center ${
                activeButton === "short" ? "border-2 border-white" : ""
              }`}
            >
              <FaClock className="inline-block mr-1" /> 25 focus + 15 break
              (Short)
            </button>
            <button
              onClick={() => handleTimeChange(2100, 900, "medium")}
              className={`px-4 py-2  rounded transition-colors  hover:border-b-2 duration-300 mr-2 flex items-center ${
                activeButton === "medium" ? "border-2 border-white" : ""
              }`}
            >
              <FaRegClock className="inline-block mr-1" /> 35 focus + 15 break
              (Medium)
            </button>
            <button
              onClick={() => handleTimeChange(2700, 900, "long")}
              className={`px-4 py-2  rounded transition-colors  hover:border-b-2 duration-300 flex items-center ${
                activeButton === "long" ? "border-2 border-white" : ""
              }`}
            >
              <FaHourglassHalf className="inline-block mr-1" /> 45 focus + 15
              break (Long)
            </button>
          </div>
        </div>
      )}
      <Modal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleConfirmStart}
      />
    </div>
  );
};

export default PomodoroTimer;
