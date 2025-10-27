import Column from "../../components/column/Column";
import AddColumn from "../column/AddColumn";
import { Search } from "lucide-react";
import ToggleTheme from "../ui/ToggleTheme";
import { useColumn } from "../../hooks/useColumn";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useTask } from "../../hooks/useTask";
import { useState } from "react";
import EditTaskModal from "../ui/EditTaskModal";

const Board = () => {
    const defaultBoardData = {
    tasks: {
      "task-1": {
        id: "task-1",
        title: "Thiết kế giao diện trang chủ",
        description: "Làm layout hero + section sản phẩm",
        priority: "High",
        createdAt: "2025-10-20T08:30:00",
      },
      "task-2": {
        id: "task-2",
        title: "Tạo component Button chung",
        description: "Viết component tái sử dụng bằng Tailwind",
        priority: "Medium",
        createdAt: "2025-10-21T10:15:00",
      },
      "task-3": {
        id: "task-3",
        title: "Tối ưu tốc độ load ảnh",
        description: "Dùng lazy loading và ảnh webp",
        priority: "Low",
        createdAt: "2025-10-21T13:00:00",
      },
      "task-4": {
        id: "task-4",
        title: "Thêm dark/light theme toggle",
        description: "Sử dụng useLocalStorage để lưu theme",
        priority: "Medium",
        createdAt: "2025-10-22T09:20:00",
      },
      "task-5": {
        id: "task-5",
        title: "Viết logic drag & drop",
        description: "Dùng dnd-kit để kéo thả task giữa các cột",
        priority: "High",
        createdAt: "2025-10-22T16:45:00",
      },
    },
    columns: {
      "column-1": {
        id: "column-1",
        title: "Todo",
        taskIds: ["task-1", "task-2"],
      },
      "column-2": {
        id: "column-2",
        title: "In Progress",
        taskIds: ["task-3", "task-4"],
      },
      "column-3": {
        id: "column-3",
        title: "Done",
        taskIds: ["task-5"],
      },
    },
    columnOrder: ["column-1", "column-2", "column-3"],
  };
  
  const [boarData, setBoardData] = useLocalStorage(
    "board-data",
    defaultBoardData
  );

    const { addTask, deleteTask, updateTask } = useTask(setBoardData);
  const { addColumn, deleteColumn } = useColumn(setBoardData);

   const [editingTask, setEditingTask] = useState(null);

  const handleOpenModal = (task) => {
    setEditingTask({...task}); 

  };

  const handleCloseModal = () => setEditingTask(null);

  const handleUpdateTask = (newTask) => {
      updateTask(newTask);
  }




  const handleAddColumn = (columnTitle) => {
    addColumn(columnTitle);
  };

  const handleDeleteColumn = (columnId) => {
    deleteColumn(columnId);
  };

  const handleAddTask = (newTask, columnId) => {
    addTask(newTask, columnId);
  };

  const handleDeleteTask = (taskId, columnId) => {
    deleteTask(taskId, columnId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-6">
      <div className="board-bar h-12 flex items-center justify-end px-4 gap-5 border-b-2 border-black bg-white text-black dark:text-white dark:border-white dark:bg-black ">
        <Search />
        <ToggleTheme />
      </div>

      <div className="flex gap-5 overflow-x-auto pb-4">
        {boarData.columnOrder.map((columnId) => {
          const column = boarData.columns[columnId];
          const tasks = column.taskIds.map((taskId) => boarData.tasks[taskId]);
          return (
            <Column
              key={column.id}
              column={column}
              tasks={tasks}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onDeleteColumn={handleDeleteColumn}
              handleOpenModal={handleOpenModal}
            />
          );
        })}

        <AddColumn onAddColumn={handleAddColumn} />
      </div>
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={handleCloseModal}
          isOpen= {!!editingTask}
          onUpdateTask = {handleUpdateTask}
        />
      )}
    </div>
  );
};

export default Board;
