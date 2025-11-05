import { PencilLine, Trash2 } from "lucide-react";
import { formatDate } from "../../utils/Date";
import { useContext, useEffect, useState } from "react";
import { BoardContext } from "../../contexts/boardContext";

const TaskCard = ({ task, columnId }) => {
  const { handleDeleteTask, openEditTask } = useContext(BoardContext);

  const priorityColors = {
    High: "bg-red-500",
    Medium: "bg-yellow-500",
    Low: "bg-emerald-500",
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkDevice = () => {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      setIsMobile(/Mobi|Android|iPhone|iPad|iPod/i.test(ua));
    };
    checkDevice();
  }, []);

  return (
    <div
      className="bg-white dark:bg-gray-200 px-4 pt-4 pb-3
        shadow-[0_4px_7px_rgba(0,0,0,0.20)]
        hover:border-black transition-all group
        rounded-lg border relative dark:hover:scale-[0.97]"
    >
      <div className="flex items-start justify-between gap-2 mb-2 w-[85%] sm:w-auto">
        <h4 className="font-medium truncate  text-gray-900 text-sm flex-1">
          {task.title}
        </h4>

        <div
          className={`flex ${
            isMobile ? "top-1 right-1 flex-col gap-2" : "top-2 flex-col right-2 gap-2"
          } absolute z-10 cursor-pointer gap-1`}
        >
          <button
            onClick={() => openEditTask(task)}
            className={`${
              isMobile ? "opacity-100 bg-slate-300" : "opacity-0"
            } group-hover:opacity-100 p-1 text-gray-700 group-hover:bg-gray-300 rounded-lg`}
          >
            <PencilLine size={20} />
          </button>
          <button
            onClick={() => handleDeleteTask(task.id, columnId)}
            className={`${
              isMobile ? "opacity-100 bg-slate-300" : "opacity-0"
            } group-hover:opacity-100 text-gray-700 p-1 group-hover:bg-gray-300 rounded-lg`}
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
        {task.description || ""}
      </p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div
          className={`${priorityColors[task.priority]} w-3 h-3 rounded-full border border-black flex-shrink-0`}
        ></div>
        <span>{formatDate(task.createdAt)}</span>
      </div>
    </div>
  );
};

export default TaskCard;
