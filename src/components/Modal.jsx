// src/components/Modal.jsx
import React from "react";
import {
  FaCheck,
  FaTimes,
  FaCoffee,
  FaBan,
  FaLaptop,
  FaBullseye,
  FaStickyNote,
} from "react-icons/fa";

const Modal = ({ isVisible, onClose, onConfirm }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-teal-900 text-white bg-opacity-75 z-50">
      <div className="bg-teal-700 p-6 rounded shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Preparation Reminder</h2>
        <p className="mb-4">
          Before starting the timer, please make sure you have done the
          following:
        </p>
        <ul className="list-disc text-start list-inside mb-4 ml-2">
          <li className="flex items-center">
            <FaCoffee className="mr-2" /> Prepare a cup or bottle of water
          </li>
          <li className="flex items-center">
            <FaBan className="mr-2" /> Eliminate distractions
          </li>
          <li className="flex items-center">
            <FaLaptop className="mr-2" /> Set up your workspace
          </li>
          <li className="flex items-center">
            <FaBullseye className="mr-2" /> Have a clear goal for this session
          </li>
          <li className="flex items-center">
            <FaStickyNote className="mr-2" /> If you have any distractions,
            write in a notes
          </li>
        </ul>
        <div className="flex justify-center gap-2">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-inherit border-b-2 rounded hover:border-2 transition-colors duration-300 flex items-center"
          >
            <FaCheck className="mr-2" /> Start Timer
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-inherit border-b-2 rounded hover:border-2 transition-colors duration-300 flex items-center"
          >
            <FaTimes className="mr-2" /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
