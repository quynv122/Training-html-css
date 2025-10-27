import { GripVertical, Trash2 } from "lucide-react";
import TaskCard from "../task-card/TaskCard";

import AddTaskCard from "../task-card/AddTaskCard";


const Column = ({ column, tasks, onDeleteColumn, onAddTask, onDeleteTask, handleOpenModal }) => {

  return (
    <div className="bg-gray-50 dark:bg-black text-black dark:text-white border border-black dark:border-white

     rounded-xl p-4 w-80 flex-shrink-0 h-fit">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GripVertical size={18} className="text-gray-400 cursor-grab" />
          <h3 className="font-semibold text-base">{column.title}</h3>
          <span className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onDeleteColumn(column.id)}
          className="text-gray-500 hover:text-red-500 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>
      
      <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 scrollbar-thin">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            columnId = {column.id}
            onDeleteTask={onDeleteTask}
            handleOpenModal={handleOpenModal}
          />
        ))}
        <AddTaskCard columnId= {column.id} onAddTask={onAddTask}/>
      </div>
    </div>
  );
};

export default Column;
