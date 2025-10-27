import { PencilLine, Trash2, Clock } from "lucide-react";


const TaskCard = ({ task, columnId, onDeleteTask, handleOpenModal }) => {


  const priorityColors = {
    High: "bg-red-100 text-red-700 border-red-200",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Low: "bg-green-100 text-green-700 border-green-200",
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-black hover:shadow-md transition-all  group">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-medium text-gray-900 text-sm flex-1">
            {task.title}
          </h4>
          <div>
            
            <button
            onClick={() =>handleOpenModal(task)}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all">
              <PencilLine size={14} />
            </button>
            <button
              onClick={() => onDeleteTask(task.id, columnId)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span
            className={`text-xs px-2 py-1 rounded-full border ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock size={12} />
            {formatDate(task.createdAt)}
          </span>
        </div>
      </div>
    </>
  );
};
export default TaskCard;
