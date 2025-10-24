import { createPortal } from "react-dom";
import { useState, useContext } from "react";
import { BoardContext } from "../contexts/BoardContext";

const ModalAddTask = ({ isShowing, onClose, columnId, columnTitle }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const { handleAddTask } = useContext(BoardContext);

  const handleSubmit = () => {
    if (!taskTitle.trim()) return;

    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 19);
    const taskId = crypto.randomUUID();

    handleAddTask(
      {
        id:taskId,
        title: taskTitle,
        description: description,
        priority: priority,
        createdAt: localDate,
        
      },
      taskId,
      columnId
    );

    setTimeout(() => handleClose(), 0);
  };

  const handleClose = () => {
    setTaskTitle("");
    setDescription("");
    setPriority("Medium");
    onClose();
  };

  if (!isShowing) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-start justify-center pt-20 z-50"
      onClick={handleClose}
    >
      <div
        className="bg-slate-800 rounded-lg shadow-xl p-4 w-[380px] animate-in fade-in slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-white font-bold text-xl text-center mb-3">
          {columnTitle || "Add New Task"}
        </h3>

        <input
          type="text"
          placeholder="Enter task title..."
          
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          autoFocus
          className="w-full px-3 py-2 bg-slate-700 text-white placeholder-slate-400 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        />

        <textarea
          placeholder="Enter description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 bg-slate-700 text-white placeholder-slate-400 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 resize-none"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full px-3 py-2 bg-slate-700 text-white border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalAddTask;
