import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import {
  FaPlay,
  FaPause,
  FaClock,
  FaRegClock,
  FaHourglassHalf,
} from "react-icons/fa";

const PomodoroTimer = () => {
  const [time, setTime] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    work: 1500,
    break: 900,
  });
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        showNotification("Break Session Started", {
          body: "Time for a break! Enjoy your rest.",
          icon: "break_icon_url", // URL icon for break session
        });
      } else {
        setTime(selectedOption.work);
        setIsWorkSession(true);
        showNotification("Focus Session Started", {
          body: "Back to work! Stay focused.",
          icon: "work_icon_url", // URL icon for focus session
        });
      }
    }
    return () => clearInterval(interval);
  }, [isActive, time, isWorkSession, selectedOption]);

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

  const handleTimeChange = (e) => {
    const selectedValue = e.target.value;
    let work, breakTime;
    switch (selectedValue) {
      case "beginner":
        work = 1500; // 25 minutes
        breakTime = 900; // 15 minutes
        break;
      case "normal":
        work = 2100; // 35 minutes
        breakTime = 900; // 15 minutes
        break;
      case "expert":
        work = 2700; // 45 minutes
        breakTime = 900; // 15 minutes
        break;
      default:
        work = 1500;
        breakTime = 900;
    }
    setSelectedOption({ work, break: breakTime });
    setTime(work);
    setIsWorkSession(true);
    setIsActive(false);
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
            stroke="blue"
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
      <div className="mb-4">
        <button
          onClick={handleStartPause}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300 mr-2"
        >
          {isActive ? <FaPause /> : <FaPlay />}
          <span className="ml-2">{isActive ? "Pause" : "Start"}</span>
        </button>
      </div>
      {!isActive && (
        <div className="mb-4">
          <label htmlFor="time-select" className="mr-2">
            Select Timer:
          </label>
          <select
            id="time-select"
            onChange={handleTimeChange}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            <option value="beginner">
              <FaClock className="inline-block mr-1" /> 25 focus + 15 break
              (Short)
            </option>
            <option value="normal">
              <FaRegClock className="inline-block mr-1" /> 35 focus + 15 break
              (Middle)
            </option>
            <option value="expert">
              <FaHourglassHalf className="inline-block mr-1" /> 45 focus + 15
              break (Long)
            </option>
          </select>
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
