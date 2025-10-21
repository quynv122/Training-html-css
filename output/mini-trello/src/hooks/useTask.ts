import { useState, useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

// Kiểu dữ liệu
interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: "High" | "Medium" | "Low";
  createdAt: string;
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface BoardData {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
}

export function useTasks() {
  // 🗃️ Lưu board vào localStorage
  const [stored, setStored] = useLocalStorage<BoardData>("kanban-data");
  const [data, setData] = useState<BoardData>(
    stored ?? {
      tasks: {
        "task-1": { id: "task-1", title: "Làm slide báo cáo", createdAt: "2025-10-20T09:00:00" },
        "task-2": { id: "task-2", title: "Code trang đăng nhập", createdAt: "2025-10-21T09:00:00" },
        "task-3": { id: "task-3", title: "Chuẩn bị buổi review sprint", createdAt: "2025-10-22T09:00:00" },
      },
      columns: {
        "col-1": { id: "col-1", title: "To Do", taskIds: ["task-1", "task-2"] },
        "col-2": { id: "col-2", title: "In Progress", taskIds: ["task-3"] },
        "col-3": { id: "col-3", title: "Done", taskIds: [] },
      },
      columnOrder: ["col-1", "col-2", "col-3"],
    }
  );

  // 🔁 Lưu mỗi khi data thay đổi
  useEffect(() => {
    setStored(data);
  }, [data, setStored]);

  // 🧩 Di chuyển task giữa cột
  const moveTask = (source: any, destination: any, draggableId: string) => {
    const startCol = data.columns[source.droppableId];
    const endCol = data.columns[destination.droppableId];

    // Nếu cùng cột → reorder taskIds trong 1 mảng
    if (startCol === endCol) {
      const newTaskIds = Array.from(startCol.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...startCol, taskIds: newTaskIds };
      setData({
        ...data,
        columns: { ...data.columns, [newColumn.id]: newColumn },
      });
      return;
    }

    // Nếu khác cột → remove + insert taskId
    const startTaskIds = Array.from(startCol.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...startCol, taskIds: startTaskIds };

    const endTaskIds = Array.from(endCol.taskIds);
    endTaskIds.splice(destination.index, 0, draggableId);
    const newEnd = { ...endCol, taskIds: endTaskIds };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newEnd.id]: newEnd,
      },
    });
  };

  // ➕ Thêm task mới vào cột
  const addTask = (columnId: string, task: Task) => {
    setData((prev) => ({
      ...prev,
      tasks: { ...prev.tasks, [task.id]: task },
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          taskIds: [...prev.columns[columnId].taskIds, task.id],
        },
      },
    }));
  };

  // ❌ Xóa task
  const deleteTask = (columnId: string, taskId: string) => {
    const newTasks = { ...data.tasks };
    delete newTasks[taskId];

    const newTaskIds = data.columns[columnId].taskIds.filter((id) => id !== taskId);
    setData({
      ...data,
      tasks: newTasks,
      columns: { ...data.columns, [columnId]: { ...data.columns[columnId], taskIds: newTaskIds } },
    });
  };

  // ✏️ Đổi tên cột
  const renameColumn = (columnId: string, newTitle: string) => {
    setData({
      ...data,
      columns: {
        ...data.columns,
        [columnId]: { ...data.columns[columnId], title: newTitle },
      },
    });
  };

  return { data, moveTask, addTask, deleteTask, renameColumn };
}
