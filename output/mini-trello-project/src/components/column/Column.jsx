import TaskCard from "../task-card/TaskCard";
import { Ellipsis, Plus } from "lucide-react";
import { useContext, useRef } from "react";
import { BoardContext } from "../../contexts/boardContext";

import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const Column = ({ column, columnTasks }) => {

  const { openEditColumn, openAddTask } = useContext(BoardContext);

  const btnEditColumn = useRef(null);
  const btnAddTask = useRef(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: column.id,
      data: { ...column },
    });

  // custom styles cho column
  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: "100%", 
    opacity: isDragging ? 0.7: undefined
  };

  const onEditColumn = () => {
    const rect = btnEditColumn.current.getBoundingClientRect();
    openEditColumn(column, rect);
  };

  const onAddTask = () => {
    const rect = btnAddTask.current.getBoundingClientRect();
    openAddTask(column.id, rect);
  };

  return (
    <div
      ref={setNodeRef}
      style={dndKitColumnStyles}
      {...attributes}
      className=" min-w-80 max-w-80 md:max-w-60"  
    >
      <div
        {...listeners}
        className=" bg-[rgb(163,233,204)] dark:bg-[rgba(19,51,59)] border border-black dark:border-white 
        shadow-[0_5px_10px_rgba(0,0,0,0.35)] rounded-lg overflow-hidden"
      >
        <div className="flex items-center justify-between max-h-[4rem] h-[4rem] px-4 gap-4">
          <h3 className="w-[90%] truncate text-lg text-black dark:text-white font-semibold">
            {column.title}
          </h3>
          <button
            ref={btnEditColumn}
            onClick={onEditColumn}
            className="text-black dark:text-white rounded hover:bg-[rgb(34,126,89)]"
          >
            <Ellipsis />
          </button>
        </div>

        <SortableContext
          items={columnTasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="max-h-[calc(100vh-22rem)] overflow-y-auto overflow-x-hidden px-3 pb-3">
            {columnTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                columnId={column.id}
                index={index}
              />
            ))}

            <button
              ref={btnAddTask}
              onClick={onAddTask}
              className="bg-[rgb(59,209,147)] dark:bg-[rgb(19,70,49)] dark:border-white dark:hover:bg-[rgb(2,119,72)] dark:text-white
            hover:bg-[rgb(34,126,89)] rounded-lg p-2 w-full flex-shrink-0 transition-all
               flex items-center justify-center gap-2 border border-black h-fit"
            >
              <Plus size={20} />
              <span className="font-medium">Thêm thẻ mới</span>
            </button>
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default Column;
