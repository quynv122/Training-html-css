import { useColumn } from "../../hooks/useColumn";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useTask } from "../../hooks/useTask";
import { useMemo, useState} from "react";
import { toast } from "react-toastify";
import { BoardContext } from "../../contexts/boardContext";
import BoardBar from "../ui/BoardBar";
import ModalEditColumn from "../column/ModalEditColumn";
import ModalAddTask from "../task-card/ModalAddTask";
import ColumnList from "../column-list/ColumnList";
import ModalEditTask from "../task-card/ModalEditTask";
import { DragDropContext } from "@hello-pangea/dnd";



const Board = () => {
  // dữ liệu mẫu
  const defaultData = {
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
      "task-4": {
        id: "task-4",
        title: "Thiết lập cấu trúc dự án React",
        description: "Tạo folder structure + alias + Tailwind setup",
        priority: "Medium",
        createdAt: "2025-10-23T10:30:00",
      },
      "task-5": {
        id: "task-5",
        title: "Tối ưu UI Dark/Light mode",
        description: "Thêm logic toggle + CSS variables",
        priority: "Low",
        createdAt: "2025-10-25T11:15:00",
      },
      "task-6": {
        id: "task-6",
        title: "Triển khai dự án lên Vercel",
        description: "Cấu hình vercel.json + env + deploy lần đầu",
        priority: "High",
        createdAt: "2025-10-26T14:00:00",
      },
    },

    columns: {
      "column-1": {
        id: "column-1",
        title: "Việc cần làm",
        taskIds: ["task-1", "task-2", "task-4"],
      },
      "column-2": {
        id: "column-2",
        title: "Đang thực hiện",
        taskIds: ["task-3"],
      },
      "column-3": {
        id: "column-3",
        title: "Hoàn thành",
        taskIds: ["task-5", "task-6"],
      },
    },

    columnOrder: ["column-1", "column-2", "column-3"],
  };

  const [boardData, setBoardData] = useLocalStorage("board-data", defaultData);

  const { addTask, deleteTask, updateTask } = useTask(setBoardData);
  const { addColumn, deleteColumn, updateColumn } = useColumn(setBoardData);

  // state cho tìm kiếm và bộ lọc
  const [keyWord, setKeyWord] = useState("");
  const [priority, setPriority] = useState("");

  // lọc dữ liệu của board dựa vào poriority và input search trước khi render
  const filteredData = useMemo(() => {
    if (!boardData.tasks) {
      return {
        ...boardData,
        tasks: {},
      };
    }
    // Nếu không có priority và không có keyword -> trả toàn bộ
    if (priority === "" && keyWord === "") return boardData;

    const lowerKey = keyWord.toLowerCase();

    // Bắt đầu lọc task theo priority + keyword
    const filteredTasks = Object.fromEntries(
      Object.entries(boardData?.tasks).filter(([, task]) => {
        const matchPriority =
          priority === "" ||
          task.priority.toLowerCase() === priority.toLowerCase();
        const matchKeyword =
          keyWord === "" || task.title.toLowerCase().includes(lowerKey);
        return matchPriority && matchKeyword;
      })
    );

    // cập nhật lại các cột chỉ chứa taskIds hợp lệ
    const filteredColumns = Object.fromEntries(
      Object.entries(boardData?.columns).map(([id, column]) => [
        id,
        {
          ...column,
          taskIds: column.taskIds.filter((taskId) => filteredTasks[taskId]),
        },
      ])
    );

    return {
      ...boardData,
      tasks: filteredTasks,
      columns: filteredColumns,
    };
  }, [boardData, keyWord, priority]);

  // thêm task mới
  const [addingTask, setAddingTask] = useState(null);
  const openAddTask = (columnId, rect) => {
    setAddingTask({ columnId, rect });
  };
  const closeAddTask = () => {
    setAddingTask(null);
  };
  const handleAddTask = (newTask, columnId) => {
    addTask(newTask, columnId);
    setAddingTask(null);    
    setKeyWord("");
    setPriority("");
    toast.success("Đã thêm thẻ mới");
  };

  // chỉnh sửa task
  const [editingTask, setEditingTask] = useState(null);
  const openEditTask = (task) => setEditingTask({ ...task });
  const closeEditTask = () => setEditingTask(null);
  const handleUpdateTask = (newTask) => {
    updateTask(newTask);
    toast.success("Đã cập nhật thông tin thẻ");
  };

  //xóa task
  const handleDeleteTask = (taskId, columnId) => {
    deleteTask(taskId, columnId);
    toast.success("Đã xóa thẻ");
  };

  // thêm column
  const handleAddColumn = (columnTitle) => {
    addColumn(columnTitle);
    setKeyWord("");
    setPriority("");
    toast.success("Đã thêm danh sách mới");
  };

  // chỉnh sửa column
  const [editingColumn, setEditingColumn] = useState(null);
  const openEditColumn = (column, rect) => {
    setEditingColumn({ column, rect });
  };
  const closeEditColumn = () => {
    setEditingColumn(null);
  };
  const handleUpdateColumn = (newColumn, columnId) => {
    updateColumn(newColumn, columnId);
  };

  // xóa column
  const handleDeleteColumn = (columnId) => {
    deleteColumn(columnId);
    toast.success("Đã xóa danh sách");
  };

  // xử lý dnd
  const handleDragEnd = (result) => {
    const { source, destination, draggableId, type } = result;

    // kéo ra ngoài vùng chứa
    if (!destination) return;

    // Nếu cùng vị trí thì bỏ qua
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // clone dữ liệu gốc
    let newBoard = structuredClone(boardData);

    // KÉO COLUMN
    if (type === "COLUMN") {
      const newColumnOrder = Array.from(newBoard.columnOrder);
      const [moved] = newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, moved);
      newBoard.columnOrder = newColumnOrder;
      setBoardData(newBoard);
      return;
    }

    //KÉO TASK
    if (type === "TASK") {
      // id task đc kéo
      const activeTaskId = draggableId;

      // Nếu cùng column
      if (source.droppableId === destination.droppableId) {
        //id column
        const columnId = source.droppableId;
        // lấy ra column
        const column = newBoard.columns[columnId];
        // lấy danh sách task từ dữ liệu gốc
        const taskIds = Array.from(column.taskIds);
        // Lấy id task bị thế chỗ theo index trong filteredData (trong result không có id của task bị thế chỗ mà chỉ có index)
        const overTaskId =
          filteredData.columns[columnId].taskIds[destination.index];

        // tìm index thật trong dữ liệu gốc
        const overIndex = taskIds.indexOf(overTaskId);

        // Di chuyển task
        const newTaskIds = taskIds.filter((id) => id !== activeTaskId); // xóa activeTaskId hỏi danh sách task
        newTaskIds.splice(overIndex, 0, activeTaskId); // thêm lại activeTaskId vào vị trí mới

        newBoard = {
          ...newBoard,
          columns: {
            ...newBoard.columns,
            [columnId]: { ...newBoard.columns[columnId], taskIds: newTaskIds },
          },
        };
        // Cập nhật dữ liệu state gốc
        setBoardData(newBoard);

        return;
      }
      // Nếu khác column
      else {
        // id task bị kéo
        const activeTaskId = draggableId;
        // lấy ra 2 column sau khi kéo và thả task
        const sourceCol = newBoard.columns[source.droppableId];
        const destCol = newBoard.columns[destination.droppableId];

        // Xóa activeTaskId ra khỏi column cũ
        const updatedSourceCol = {
          ...sourceCol,
          taskIds: sourceCol.taskIds.filter((id) => id !== activeTaskId),
        };

        // nếu over index === 0 thì thêm vào vị trí đầu trong column mới
        if (destination.index === 0) {
          // Thêm activeTaskId vào đầu destCol.taskIds
          const updatedDestCol = {
            ...destCol,
            taskIds: [activeTaskId, ...destCol.taskIds],
          };

          newBoard = {
            ...newBoard,
            columns: {
              ...newBoard.columns,
              [source.droppableId]: updatedSourceCol,
              [destination.droppableId]: updatedDestCol,
            },
          };

          setBoardData(newBoard);
          return;
        } else {
          // nếu over index lớn hơn 0
          //Vì dữ liệu hiển thị có thể là dữ liệu đã search, filter -> index sẽ bị sai so vơi dữ liệu góc.
          // phải dựa vào task đứng trước đó -> tìm ra vị trí thật của task đứng trước đó trong dữ liệu gốc -> thêm task mới vào sau vị trí đó

          // id task bị kéo
          const activeTaskId = draggableId;

          // lấy ra 2 column sau khi kéo và thả task
          const sourceCol = newBoard.columns[source.droppableId];
          const destCol = newBoard.columns[destination.droppableId];

          // Xóa activeTaskId ra khỏi column cũ
          const updatedSourceCol = {
            ...sourceCol,
            taskIds: sourceCol.taskIds.filter((id) => id !== activeTaskId),
          };

          // index của task đứng trước overtask
          const preTaskIndexOfOverTask = destination.index - 1;
          // tìm ra id của task đứng trước
          const preOverTaskId =
            filteredData.columns[destination.droppableId].taskIds[
              preTaskIndexOfOverTask
            ];
          // tìm vị trí thật trong dữ liệu gốc
          const realOverIndex = destCol.taskIds.indexOf(preOverTaskId) + 1;

          // thêm task vào vị trí thật
          const newTaskIds = [...destCol.taskIds];
          newTaskIds.splice(realOverIndex, 0, activeTaskId);
          const updatedDestCol = {
            ...destCol,
            taskIds: newTaskIds,
          };
          newBoard = {
            ...newBoard,
            columns: {
              ...newBoard.columns,
              [source.droppableId]: updatedSourceCol,
              [destination.droppableId]: updatedDestCol,
            },
          };
          setBoardData(newBoard);
          return;
        }
      }
    }
  };

  return (
    <BoardContext.Provider
      value={{
        openEditColumn, handleUpdateColumn, closeEditColumn,
        handleAddColumn, handleDeleteColumn,
        openEditTask, handleUpdateTask,  handleDeleteTask,
        openAddTask, handleAddTask, closeAddTask,
      }}
    >
      <BoardBar
        key={`${keyWord}-${priority}`}
        onSearch={(keyWord) => setKeyWord(keyWord)}
        onFilter={(priority) => setPriority(priority)}
        currentKey={keyWord}
        currentPriority={priority}
      />

      <div
        className="overflow-y-hidden h-[calc(100vh-10rem)] "
      >
        <DragDropContext
         onDragEnd={handleDragEnd}>
          <ColumnList
            columns={filteredData.columns}
            tasks={filteredData.tasks}
            columnOrder={filteredData.columnOrder}
          />
        </DragDropContext>

        {editingTask && (
          <ModalEditTask
            isOpen={!!editingTask}
            onClose={closeEditTask}
            task={editingTask}
          />
        )}

        {editingColumn && (
          <ModalEditColumn
            isOpen={!!editingColumn}
            column={editingColumn.column}
            rect={editingColumn.rect}
          />
        )}

        {addingTask && (
          <ModalAddTask
            isOpen={!!addingTask}
            columnId={addingTask.columnId}
            rect={addingTask.rect}
          />
        )}
      </div>
    </BoardContext.Provider>
  );
};

export default Board;
