import { PencilLine, Trash2, Calendar, Flag } from "lucide-react";
import { useContext } from "react";
import { BoardContext } from "../../contexts/BoardContext";
import ModalEditTask from "../ModalEditTask";
import useModalEditTask from "../../hooks/useModalEditTask";


const TaskCard = ({ task, columnId, columnTitle }) => {
 


  const { handleDeleteTask } = useContext(BoardContext);
  const { isShowingModalEditTask, toggleModalEditTask } = useModalEditTask();
  
  const priorityConfig = {
    High: {
      bg: "bg-red-100",
    },
    Medium: {
      bg: "bg-amber-100",
    },
    Low: {
      bg: "bg-emerald-100",
    },
  };

  const config = priorityConfig[task.priority] || priorityConfig.Low;

  return (
   
    <div className={ `group mb-4 ${config.bg} relative  border border-slate-300 dark:border-slate-800 rounded-lg p-3 transition-all duration-200 cursor-pointer`}>
      <div className="flex justify-between items-start gap-2 mb-2">
        <h3
          className="font-semibold text-l text-black line-clamp-1 flex-1"
          title={task.title}
        >
          {task.title}
        </h3>

        <div className="absolute  right-3 bottom-2 z-999 opacity-0 flex gap-1  group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={toggleModalEditTask}
            className="rounded-md transition-colors mr-3"
            title="Edit task"
          >
            <PencilLine
              size={17}
              className="text-black hover:text-blue-600"
            />
          </button>
          <button
            onClick={() => handleDeleteTask(task.id, columnId)}
            className=" rounded-md transition-colors"
            title="Delete task"
          >
            <Trash2 size={17} className="text-black hover:text-red-600" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-black line-clamp-1 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}
      <ModalEditTask
        show={isShowingModalEditTask}
        onClose={toggleModalEditTask}
        task={task}
        columnTitle = {columnTitle}
      />
    </div>
  );
};

export default TaskCard;
