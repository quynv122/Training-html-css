import BoardPage from "./BoardPage"

function BoardPageContainer () {
     const boardData = {
    tasks: {
      "task-1": {
        id: "task-1",
        title: "Thiết kế UI",
        description: "Tạo giao diện trang chủ",
        priority: "High",
        createdAt: "2025-10-21",
      },
      "task-2": {
        id: "task-2",
        title: "Kết nối API",
        description: "Lấy dữ liệu sản phẩm từ backend",
        priority: "Medium",
        createdAt: "2025-10-22",
      },
      "task-3": {
        id: "task-3",
        title: "Fix bug",
        description: "Sửa lỗi responsive trên mobile",
        priority: "Low",
        createdAt: "2025-10-23",
      },
    },
    columns: {
      "col-1": { id: "col-1", title: "To Do", taskIds: ["task-1","task-2"] },
      "col-2": { id: "col-2", title: "In Progress", taskIds: ["task-2"] },
      "col-3": { id: "col-3", title: "Done", taskIds: ["task-3"] },
    },
    columnOrder: ["col-1", "col-2", "col-3"],
  };
    return(
        <BoardPage data={boardData}/>
    )
}

  
export default BoardPageContainer