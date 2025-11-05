const boardData = {
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Thiết kế giao diện trang chủ",
      description: "Hero + sản phẩm nổi bật",
      priority: "High",
      createdAt: "2025-10-20T08:30:00",
    },
    "task-2": {
      id: "task-2",
      title: "Tạo API đăng nhập",
      description: "POST /auth/login + JWT",
      priority: "Medium",
      createdAt: "2025-10-21T09:15:00",
    },
    "task-3": {
      id: "task-3",
      title: "Test form liên hệ",
      description: "Kiểm tra validation + gửi email",
      priority: "Low",
      createdAt: "2025-10-22T10:00:00",
    },
  },

  columns: {
    "column-1": {
      id: "column-1",
      title: "Việc cần làm",
      taskIds: ["task-1", "task-2"],
    },
    "column-2": {
      id: "column-2",
      title: "Đang thực hiện",
      taskIds: ["task-3"],
    },
    "column-3": {
      id: "column-3",
      title: "Hoàn thành",
      taskIds: [],
    },
  },

  // Thứ tự hiển thị các cọt
  columnOrder: ["column-1", "column-2", "column-3"],
};
