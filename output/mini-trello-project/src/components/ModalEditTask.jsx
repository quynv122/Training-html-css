import { useState, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { BoardContext } from "../contexts/BoardContext";

const ModalEditTask = ({ show, onClose, task, columnTitle }) => {
  const { handleEditTask } = useContext(BoardContext);
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");

  useEffect(() => {
    if (show && task) {
      setTaskTitle(task.title );
      setDescription(task.description );
      setPriority(task.priority );
    }
  }, [show, task]);

  const handleSubmit = () => {
    if (!taskTitle.trim()) return;

    const newTask = {
      ...task,
      title: taskTitle,
      description,
      priority,
    };

    handleEditTask(task.id, newTask);
    onClose(); 
  };

  if (!show) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start justify-center pt-20 z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 text-white rounded-lg shadow-xl p-5 w-[380px]
                   animate-in fade-in slide-in-from-top-4 duration-200"
      >
        <h3 className="font-bold text-lg text-center mb-3">{columnTitle}</h3>


        <input
          type="text"
          placeholder="Enter task title..."
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="w-full px-3 py-2 bg-slate-700 border-2 border-blue-400 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        />


        <textarea
          placeholder="Enter description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-24 px-3 py-2 bg-slate-700 border-2 border-blue-400 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 resize-none"
        />

        <div className="mb-4">
          <label className="text-sm mb-1 block">Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border-2 border-blue-400 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>


        <input
          type="text"
          readOnly
          value={task.createdAt}
          className="w-full px-3 py-2 bg-slate-700 border-2 border-blue-400 rounded-lg
                     focus:outline-none focus:ring-0 mb-3"
        />


        <div className="flex justify-end gap-2">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalEditTask;
