import ToggleTheme from "../../components/ToggleTheme";
import BoardPage from "./BoardPage";
import { Search } from "lucide-react";
import { BoardContext } from "../../contexts/BoardContext";
import useLocalStorage from "../../hooks/useLocalStorage";

import { toast } from "react-toastify";
import AddColumn from "../../components/AddColumn";




const BoardPageContainer = () => {
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

  const [boardData, setBoardData] = useLocalStorage(
    "boardData",
    defaultBoardData
  );

  const handleAddColumn = (colName) => {
    const newColumnId = `column-${Date.now()}`;
    const newColumn = {
      id: newColumnId,
      title: colName,
      taskIds: [],
    };
    const newBoardData = {
      ...boardData,
      columns: { ...boardData.columns, [newColumnId]: newColumn },
      columnOrder: [...(boardData?.columnOrder || []), newColumnId],
    };
    setBoardData(newBoardData);
    toast.success("Đã thêm danh sách");
  };

  const handleEditColumn = (columnId) => {
    console.log("Edit column:", columnId);
  };

  const handleAddTask = (taskData, taskId, colId) => {
    const newBoardData = {
      ...boardData,
      tasks: {
        ...boardData.tasks,
        [taskId]: { ...taskData },
      },
      columns: {
        ...boardData.columns,
        [colId]: {
          ...boardData.columns[colId],
          taskIds: [...boardData.columns[colId].taskIds, taskId],
        },
      },
    };
    setBoardData(newBoardData);
    toast.success("đã thêm task");
  };

  const handleEditTask = (taskId, taskData) => {
    const newBoardData = {
      ...boardData,
      tasks: { ...boardData.tasks, [taskId]: { ...taskData } },
    };
    setBoardData(newBoardData);
    toast.success("Đã cật nhật thông tin task");
  };

  const handleDeleteTask = (taskId, columnId) => {
    const column = boardData.columns[columnId];
    if (!column) return;

    // Xóa taskId khỏi column
    const newTaskIds = column.taskIds.filter((id) => id !== taskId);

    // Xóa task khỏi danh sách tasks
    const newTasks = { ...boardData.tasks };
    delete newTasks[taskId];

    // Tạo dữ liệu mới
    const newBoardData = {
      ...boardData,
      tasks: newTasks,
      columns: {
        ...boardData.columns,
        [columnId]: {
          ...column,
          taskIds: newTaskIds,
        },
      },
    };

    // Cập nhật state
    setBoardData(newBoardData);
    toast.success("Xóa task thành công!");
  };

  return (
    <BoardContext.Provider
      value={{
        boardData,
        handleAddTask,
        handleEditColumn,
        handleEditTask,
        handleAddColumn,
        handleDeleteTask,
      }}
    >
      <div className="h-100vh w-full px-[7%] bg-white dark:bg-black ">
        <div className="board-bar h-12 flex items-center justify-end px-4 gap-5 border-b-2 border-black bg-white text-black dark:text-white dark:border-white dark:bg-black ">
          <Search />
          <ToggleTheme />
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 mt-6">
          <BoardPage />
          <AddColumn />
        </div>
      </div>
    </BoardContext.Provider>
  );
};
export default BoardPageContainer;
