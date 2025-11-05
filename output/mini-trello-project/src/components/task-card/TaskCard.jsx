import { PencilLine, Trash2 } from "lucide-react";
import { formatDate } from "../../utils/Date";
import { useContext } from "react";
import { BoardContext } from "../../contexts/boardContext";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { useState, useEffect } from "react";

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

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { ...task },
  });

  // custom styles cho task
  const dndKitTaskStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={dndKitTaskStyles}
      {...attributes}
      {...listeners}
      className="mb-2 flex-shrink-0"
    >
      <div
        className="bg-white dark:bg-gray-200 px-4 pt-4 pb-3 dark:hover:scale-95
              shadow-[0_4px_7px_rgba(0,0,0,0.20)] hover:border-black transition-all group cursor-grab rounded-lg border
              relative"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h4 className="font-medium truncate text-gray-900 text-sm flex-1">
              {task.title}
            </h4>
          </div>
          <div className={`flex ${isMobile ? "top-4 right-2" : "top-2 flex-col right-4"} absolute z-10 cursor-pointer`}>
            <button
              onClick={() => openEditTask(task)}
              className={`${isMobile ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 p-1 text-gray-700 hover:bg-gray-200 rounded-lg`}
            >
              <PencilLine size={22} />
            </button>
            <button
              onClick={() => handleDeleteTask(task.id, columnId)}
              className={`${isMobile ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 text-gray-700 p-1 hover:bg-gray-200 rounded-lg`}
            >
              <Trash2 size={22} />
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {task.description || ""}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className={`${priorityColors[task.priority]} w-3 h-3 rounded-full border border-black flex-shrink-0`}></div>
          <span>{formatDate(task.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;