import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { formatDate } from "../../utils/Date";
import { useContext } from "react";
import { BoardContext } from "../../contexts/boardContext";

const ModalEditTask = ({ task, isOpen, onClose }) => {
  const { handleUpdateTask } = useContext(BoardContext);

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "Medium");
  const [activeSubmit, setActiveSubmit] = useState(true);

  useEffect(() => {
    const titleChanged = title.trim() && title.trim() !== task.title;
    const descChanged = description.trim() !== task.description;
    const priorityChanged = priority.trim() !== task.priority;
    
    if (titleChanged || descChanged || priorityChanged) {
      setActiveSubmit(false);
    } else {
      setActiveSubmit(true);
    }
  }, [title, description, priority, task]);

  const handleSubmit = () => {
    if (title.trim()) {
      handleUpdateTask({
        ...task,
        title: title.trim(),
        description: description.trim(),
        priority: priority,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="bg-white text-black border border-black 
      dark:bg-black dark:border-white dark:text-white
      rounded-xl shadow-2xl w-full max-w-lg"
      >
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-semibold">Chỉnh sửa Task</h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium  mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề task..."
              className="w-full px-4 py-2 border text-black border-black dark:border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  dark:focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả chi tiết..."
              rows="4"
              className="w-full text-black px-4 py-2 border border-black dark:border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Độ ưu tiên</label>
            <div className="flex gap-2">
              {["Low", "Medium", "High"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                    priority === p
                      ? p === "High"
                        ? "bg-red-100 text-red-700 border-2 border-red-300"
                        : p === "Medium"
                        ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-300"
                        : "bg-green-100 text-green-700 border-2 border-green-300"
                      : "bg-gray-100 text-black border-2 border-transparent hover:bg-gray-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium  mb-2">Ngày tạo</label>
            <input
              type="text"
              readOnly
              value={formatDate(task.createdAt)}
              className="w-full px-4 py-2 border text-black border-black dark:border-none rounded-lg focus:outline-none "
            />
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button
            disabled={activeSubmit}
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalEditTask;
