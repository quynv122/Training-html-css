import { Ellipsis, Plus } from "lucide-react";
import TaskCard from "../task-card/TaskCard";
import useModalAddTask from "../../hooks/useModalAddTask";
import ModalAddTask from "../ModalAddTask";

const Column = ({ column, tasks }) => {
  const { isShowingModalAddTask, toggleModalAddTask } = useModalAddTask();
  return (
    <>
      <div className="shadow-[0_20px_50px_rgba(0,0,0,0.15)] 
      dark:shadow-[0_20px_50px_rgba(255,255,255,0.3)] rounded-2xl 
      bg-white text-black border border-gray-400 p-4  min-w-[280px] w-[280px] 
      flex flex-col h-fit max-h-[calc(100vh-200px)] dark:text-white dark:border-white dark:bg-black">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-black dark:border-white">
          <div className="flex items-center gap-2 truncate mr-3">
            <h2 className="font-semibold text-xl uppercase tracking-wider">
              {column.title}
            </h2>
          </div>
          <button className=" text-fg bg-bg p-1.5 rounded-lg transition-all duration-150 hover:bg-slate-200 hover:dark:bg-slate-800">
            <Ellipsis size={18} />
          </button>
        </div>
        <div className="flex flex-col gap-3 pr-1 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400">
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                columnId={column.id}
                columnTitle = {column.title}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center pb-3 text-center">
              <p className="text-slate-400 text-m">No task</p>
            </div>
          )}
        </div>

        <button
          onClick={toggleModalAddTask}
          className="text-m font-medium flex items-center justify-center gap-2 py-2 rounded-lg 
          transition-all duration-150 group hover:bg-slate-200 hover:dark:bg-slate-700"
        >
          <div className="p-1">
            <Plus size={16}  />
          </div>
          <span>Add Task</span>
        </button>
      </div>
      <ModalAddTask
        isShowing={isShowingModalAddTask}
        onClose={toggleModalAddTask}
        columnId={column.id}
        columnTitle={column.title}
      />
    </>
  );
};

export default Column;
