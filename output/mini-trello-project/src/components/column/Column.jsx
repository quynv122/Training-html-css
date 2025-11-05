import TaskCard from "../task-card/TaskCard";
import { Ellipsis, Plus } from "lucide-react";
import { useContext, useRef } from "react";
import { BoardContext } from "../../contexts/boardContext";
import { Droppable, Draggable } from "@hello-pangea/dnd";

const Column = ({ column, columnTasks, dragHandleProps }) => {
  const { openEditColumn, openAddTask } = useContext(BoardContext);

  const btnEditColumn = useRef(null);
  const btnAddTask = useRef(null);

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
        className="min-w-[250px]  max-w-[250px] sm:min-w-80 sm:max-w-80 bg-[rgb(163,233,204)] dark:bg-[rgba(19,51,59)]  
        border border-black dark:border-white shadow-[0_5px_10px_rgba(0,0,0,0.35)] rounded-lg overflow-hidden mr-12 t"
      >
      <div
        {...dragHandleProps}
        className="flex items-center justify-between max-h-[4rem] h-[4rem] px-4 gap-4 cursor-grab"
      >
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
      <Droppable droppableId={column.id} type="TASK">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="max-h-[calc(100vh-22rem)] overflow-y-auto  px-3 pb-3 h-sm:min-h-[300px]"
          >
            {columnTasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    className="mb-2"
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    style={{
                      ...dragProvided.draggableProps.style,
                      opacity: dragSnapshot.isDragging ? 0.5 : 1,
                    }}
                  >
                    <TaskCard task={task} columnId={column.id} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            <button
              ref={btnAddTask}
              onClick={onAddTask}
              className="bg-[rgb(59,209,147)] dark:bg-[rgb(19,70,49)] dark:border-white dark:hover:bg-[rgb(2,119,72)] dark:text-white
              hover:bg-[rgb(34,126,89)] rounded-lg p-2 w-full flex-shrink-0 transition-all
              flex items-center justify-center gap-2 border border-black h-fit mt-2"
            >
              <Plus size={20} />
              <span className="font-medium">Thêm thẻ mới</span>
            </button>
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
