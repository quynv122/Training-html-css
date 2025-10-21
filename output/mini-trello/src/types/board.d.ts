export interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  createdAt: string;
}

export interface ColumnType {
  id: string;
  title: string;
  taskIds: string[];
}

export interface BoardData {
  tasks: Record<string, Task>;
  columns: Record<string, ColumnType>;
  columnOrder: string[];
}



 const  data ={
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Làm slide báo cáo sprint",
      description: "Chuẩn bị phần trình bày cho buổi review tuần này",
      priority: "High",
      createdAt: "2025-10-20T09:00:00"
    },
    "task-2": {
      id: "task-2",
      title: "Code giao diện đăng nhập",
      description: "Sử dụng React + Tailwind",
      priority: "Medium",
      createdAt: "2025-10-21T11:30:00"
    },
    "task-3": {
      id: "task-3",
      title: "Fix bug kéo thả Kanban",
      priority: "Low",
      createdAt: "2025-10-22T08:00:00"
    }
  },

  columns: {
    "col-1": {
      id: "col-1",
      title: "To Do",
      taskIds: ["task-1", "task-2"]
    },
    "col-2": {
      id: "col-2",
      title: "In Progress",
      taskIds: ["task-3"]
    },
    "col-3": {
      id: "col-3",
      title: "Done",
      taskIds: []
    }
  },

  columnOrder: ["col-1", "col-2", "col-3"]
}
