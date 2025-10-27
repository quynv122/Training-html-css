import { useState } from "react";
import { Plus } from "lucide-react";
import { getLocalISOTime } from './../../utils/Date';

const AddTaskCard = ({onAddTask, columnId}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  const handleSubmit = () => {
    if(title.trim()) {
      const newTask = {
      title: title,
      description: description,
      priority: priority,
      id: crypto.randomUUID(),
      createdAt: getLocalISOTime()
    };
    onAddTask(newTask, columnId);
    handleClose();
    }
    
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClose = () => {
    setIsAdding(false);
    setTitle("");
    setDescription("");
    setPriority("Medium");
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-full p-3 text-left text-sm hover:bg-gray-300
        dark:border-white hover:dark:bg-slate-700
         rounded-lg border border-black 
         transition-colors flex items-center gap-2"
      >
        <Plus size={16} />
        Thêm thẻ
      </button>
    );
  }

  return (
    <div className="bg-white text-black
    border-black dark:text-white dark:border-white
    dark:bg-black
     p-4 rounded-lg shadow-sm border">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Tiêu đề task..."
        className="w-full px-3 py-2 text-sm border border-black dark:border-none dark:focus:ring-yellow-500
          rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        autoFocus
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Mô tả chi tiết (không bắt buộc)"
        className="w-full px-3 py-2 text-sm border border-black dark:border-none rounded-md mt-2 focus:outline-none   dark:focus:ring-yellow-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows="2"
      />

      <div className="mt-2">
        <label className="text-xs mb-1 block">Độ ưu tiên</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full px-3 py-2 text-sm border  border-black dark:border-none rounded-md focus:outline-none focus:ring-2  dark:focus:ring-yellow-500 focus:ring-blue-500"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Thêm
        </button>
        <button
        onClick={handleClose}
         className="px-4 py-2text-sm font-medium rounded-md hover:bg-gray-300 
         border border-black dark:border-white
         hover:dark:bg-gray-700 transition-colors">
          Hủy
        </button>
      </div>
    </div>
  );
};

export default AddTaskCard;
