import { useColumn } from "../../hooks/useColumn";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useTask } from "../../hooks/useTask";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { BoardContext } from "../../contexts/boardContext";
import BoardBar from "../ui/BoardBar";
import ModalEditColumn from "../column/ModalEditColumn";
import ModalAddTask from "../task-card/ModalAddTask";
import ColumnList from "../column-list/ColumnList";
import Column from "../column/Column";
import ModalEditTask from "../task-card/ModalEditTask";

import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import TaskCard from "../task-card/TaskCard";

const Board = () => {
  const defaultData = {
    tasks: {},
    columns: {},
    columnOrder: [],
  };
  const [boardData, setBoardData] = useLocalStorage("board-data", defaultData);

  const { addTask, deleteTask, updateTask } = useTask(setBoardData);
  const { addColumn, deleteColumn, updateColumn } = useColumn(setBoardData);

  // state cho tìm kiếm và bộ lọc
  const [keyWord, setKeyWord] = useState("");
  const [priority, setPriority] = useState("");

  // state lưu trạng thái item kkhi dnd
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);

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

    // Sau đó cập nhật lại các cột chỉ chứa taskIds hợp lệ
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

  const [dataRender, setDataRender] = useState(filteredData);
  useEffect(() => {
    if (!activeDragItemId) setDataRender(filteredData);
  }, [filteredData, activeDragItemId]);

  // chỉnh sửa column
  const [editingColumn, setEditingColumn] = useState(null);
  const openEditColumn = (column, rect) => {
    setEditingColumn({ column, rect });
  };
  const closeEditColumn = () => {
    setEditingColumn(null);
  };

  // thêm task mới
  const [addingTask, setAddingTask] = useState(null);
  const openAddTask = (columnId, rect) => {
    setAddingTask({ columnId, rect });
  };
  const closeAddTask = () => {
    setAddingTask(null);
  };

  // chỉnh sửa task
  const [editingTask, setEditingTask] = useState(null);
  const openEditTask = (task) => setEditingTask({ ...task });
  const closeEditTask = () => setEditingTask(null);

  const handleAddTask = (newTask, columnId) => {
    addTask(newTask, columnId);
    setAddingTask(null);
    setKeyWord("");
    setPriority("");
    toast.success("Đã thêm thẻ mới");
  };

  const handleUpdateTask = (newTask) => {
    updateTask(newTask);
    toast.success("Đã cập nhật thông tin thẻ");
  };

  const handleDeleteTask = (taskId, columnId) => {
    deleteTask(taskId, columnId);
    toast.success("Đã xóa thẻ");
  };

  const handleAddColumn = (columnTitle) => {
    addColumn(columnTitle);
    setKeyWord("");
    setPriority("");
    toast.success("Đã thêm danh sách mới");
  };

  const handleUpdateColumn = (newColumn, columnId) => {
    updateColumn(newColumn, columnId);
  };

  const handleDeleteColumn = (columnId) => {
    deleteColumn(columnId);
    setKeyWord("");
    setPriority("");
    toast.success("Đã xóa danh sách");
  };

  // custom hiệu ứng khi drop item
  const dropAnimationn = {
    duration: 350,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0.5" } },
    }),
  };

  // Tạo MouseSensor — kích hoạt khi người dùng kéo chuột di chuyển ít nhất 10px
  const mouseSenser = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  // Tạo TouchSensor — kích hoạt khi người dùng chạm và giữ 250ms, dung sai 5px
  const touchSenser = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSenser, touchSenser);
  const ACTIVE_DRAG_ITEM_TYPE = {
    COLUMN: "COLUMN",
    TASK: "TASK",
  };

  // tìm column dựa vào task id
  const findColumnByTaskId = (taskId) => {
    if (!dataRender.columnOrder || !boardData?.columns) {
      return null;
    }
    for (const columnId of dataRender.columnOrder) {
      const column = boardData.columns[columnId];
      // Kiểm tra column và taskIds tồn tại
      if (column && column.taskIds && column.taskIds.includes(taskId)) {
        return column;
      }
    }
    return null;
  };

  const handleDragStart = (event) => {
    // state lưu id của item bị bắt đầu kéo
    setActiveDragItemId(event?.active?.id);
    // state lưu type của item - column hoặc task
    setActiveDragItemType(
      event?.active?.data?.current?.taskIds
        ? ACTIVE_DRAG_ITEM_TYPE.COLUMN
        : ACTIVE_DRAG_ITEM_TYPE.TASK
    );
    // state lưu dữ liệu của item
    setActiveDragItemData(event?.active?.data?.current);
  };

  // 🧩 Overlay khi kéo CARD: kiểm tra over = column hay card trước
  const handleDragOver = (event) => {
    // Kéo COLUMN thì bỏ
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;

    const { active, over } = event;
    console.log(active)
    console.log(over)

 
    if (!active || !over) return;

    const activeTaskId = active.id;
    const activeColumn = findColumnByTaskId(activeTaskId);
    if (!activeColumn) return;

    const overData = over.data?.current;
    const isOverColumn = overData && Array.isArray(overData.taskIds);

    // ===== 1) OVER LÀ COLUMN (xem như column trống cần nhận task)
    if (isOverColumn) {
      const overColumn = overData;

      // Cùng column thì khỏi làm gì
      if (overColumn.id === activeColumn.id) return;

      // Tránh nhân bản khi onDragOver bắn liên tục
      if (overColumn.taskIds.includes(activeTaskId)) return;

      const preview = structuredClone(dataRender);

      // Bỏ khỏi column gốc
      preview.columns[activeColumn.id].taskIds = preview.columns[
        activeColumn.id
      ].taskIds.filter((id) => id !== activeTaskId);

      // Thêm vào column đích (đầu cột; muốn cuối thì dùng length)
      const toIds = preview.columns[overColumn.id].taskIds.filter(
        (id) => id !== activeTaskId
      );
      toIds.splice(0, 0, activeTaskId);
      preview.columns[overColumn.id].taskIds = toIds;

      setDataRender(preview);
      return;
    }

    // ===== 2) OVER LÀ CARD
    const overTaskId = over.id;
    const overColumn = findColumnByTaskId(overTaskId);
    if (!overColumn) return;

    // Cùng column → KHÔNG xử lý (đúng yêu cầu mày)
    if (overColumn.id === activeColumn.id) return;

    // Khác column → tính vị trí chèn trên/dưới card bị hover
    const overIndex = overColumn.taskIds.indexOf(overTaskId);
    const isBelowOverItem = active.rect.current.translated
      ? active.rect.current.translated.top >
        over.rect.top + over.rect.height / 2
      : active.rect.current.initial.top > over.rect.top + over.rect.height / 2;

    const insertIndex =
      overIndex >= 0
        ? overIndex + (isBelowOverItem ? 1 : 0)
        : overColumn.taskIds.length;

    const preview = structuredClone(dataRender);

    // Bỏ khỏi column gốc
    const fromIds = preview.columns[activeColumn.id].taskIds.filter(
      (id) => id !== activeTaskId
    );

    // Thêm vào column đích (xóa trùng trước khi chèn)
    const toIds = preview.columns[overColumn.id].taskIds.filter(
      (id) => id !== activeTaskId
    );
    toIds.splice(insertIndex, 0, activeTaskId);

    preview.columns[activeColumn.id].taskIds = fromIds;
    preview.columns[overColumn.id].taskIds = toIds;

    setDataRender(preview);
  };

  const handleDragEnd = (event) => {
    
    // active luôn là item đc kéo - task hoặc column
    // over trong trường hợp kéo task:
    // nếu kéo task vào column trống ==> over là column trống đó.  còn trường hợp khác thì over là task bị thế chỗ (có thể cùng hoặc khác column)
    const { active, over } = event;

    if (!over) {
      return;
    }
    // xử lý thả task
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.TASK) {
      console;
      // nếu kéo thả tại chỗ
      if (active.id === over.id) {
        return;
      }
      // kéo sang chỗ khác
      else {
        // nếu kéo sang column trống ==> chưa xử lý vì chưa tìm ra cách overlay
        if (over?.data?.current?.taskIds) {
          return;
        }
        // kéo sang column có task
        else {
          // tìm ra 2 column chứa 2 task đó
          const activeColumn = findColumnByTaskId(active.id);
          const overColumn = findColumnByTaskId(over.id);
          // nếu khác column ==> chưa xử lý vì chưa tìm ra cách overlay
          if (activeColumn.id !== overColumn.id) {

            return  // thêm lodicg xử lý vào đây
            
          }
          // cùng column (đổi vị trí task trong cùng column)
          else {
            // lấy vị trí cũ và vị trí mới của task trong column
            const oldIndex = activeColumn.taskIds.indexOf(active.id);
            const newIndex = activeColumn.taskIds.indexOf(over.id);

            // Tạo mảng taskIds mới với thứ tự đã thay đổi
            const newTaskIds = arrayMove(
              activeColumn.taskIds,
              oldIndex,
              newIndex
            );

            // Cập nhật boardData
            const newBoardData = {
              ...boardData,
              columns: {
                ...boardData.columns,
                [activeColumn.id]: {
                  ...activeColumn,
                  taskIds: newTaskIds,
                },
              },
            };
            setBoardData(newBoardData);
          }
        }
      }
    }

    // XỬ LÝ KÉO COLUMN
    else if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        // lấy ra vị trí cũ- mới của column trong columnOrder
        const oldIndex = boardData.columnOrder.findIndex(
          (columnId) => columnId === active.id
        );
        const newIndex = boardData.columnOrder.findIndex(
          (columnId) => columnId === over.id
        );

        // thay đổi vị trí
        const dndColumnOrdered = arrayMove(
          boardData.columnOrder,
          oldIndex,
          newIndex
        );

        //cật nhật dữ liệu
        const newBoardData = {
          ...boardData,
          columnOrder: dndColumnOrdered,
        };
        setBoardData(newBoardData);
      }
    }
    // Reset trạng thái drag
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
  };

  return (
    <BoardContext.Provider
      value={{
        openEditTask,
        handleAddTask,
        handleDeleteTask,
        handleDeleteColumn,
        handleUpdateColumn,
        openEditColumn,
        closeEditColumn,
        openAddTask,
        closeAddTask,
        handleAddColumn,
        handleUpdateTask,
      }}
    >
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <BoardBar
          onSearch={(keyWord) => setKeyWord(keyWord)}
          onFilter={(priority) => setPriority(priority)}
        />
        <div className=" h-[calc(100vh-14rem)] overflow-y-hidden">
          <ColumnList
            columns={dataRender.columns}
            tasks={dataRender.tasks}
            columnOrder={dataRender.columnOrder}
          />
          <DragOverlay dropAnimation={dropAnimationn}>
            {!activeDragItemId && null}
            {activeDragItemId &&
              activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
                <Column
                  column={activeDragItemData}
                  columnTasks={activeDragItemData.taskIds.map(
                    (taskId) => dataRender.tasks[taskId]
                  )}
                />
              )}
            {activeDragItemId &&
              activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.TASK && (
                <TaskCard task={activeDragItemData} />
              )}
          </DragOverlay>

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
      </DndContext>
    </BoardContext.Provider>
  );
};

export default Board;
