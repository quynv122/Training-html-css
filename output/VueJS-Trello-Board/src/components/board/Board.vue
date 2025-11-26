<script setup lang="js">
import { useLocalStorage } from '../../composables/useLocalStorage';
import { computed, ref } from 'vue'
import Column from '../column/Column.vue';
import Task from '../task/Task.vue';
import AddColumn from '../ui/AddColumn.vue';
import ModalEditColumn from '../column/ModalEditColumn.vue'
import AddTask from '../ui/AddTask.vue';
import ModalFilter from '../ui/ModalFilter.vue';
import BoardBar from '../ui/BoardBar.vue';
import { getLocalISOTime } from '../../utils/date';
import ModalEditTask from '../task/ModalEditTask.vue';
import { toast } from 'vue3-toastify';
import draggable from "vuedraggable";

const boardDataTemplate = {
  columns: {
    "col-1235525234": {
      id: "col-1235525234",
      name: "Backlog",
      tasks: [
        {
          id: "task-1",
          title: "Phân tích yêu cầu dự án",
          createdAt: "2025-11-18T09:00:00.000Z",
          description: "Ngồi note lại toàn bộ tính năng cần có cho mini trello",
          priority: "High",
        },
        {
          id: "task-2",
          title: "Thiết kế cấu trúc dữ liệu",
          createdAt: "2025-11-18T10:30:00.000Z",
          description: "Quyết định dùng columns + tasks lồng trong từng column",
          priority: "Medium",
        },
        {
          id: "task-3",
          title: "Mock data ban đầu",
          createdAt: "2025-11-18T11:00:00.000Z",
          description: "Tạo một vài column + task demo để test UI",
          priority: "Low",
        },
      ],
    },

    "col-123552123": {
      id: "col-123552123",
      name: "In Progress",
      tasks: [
        {
          id: "task-4",
          title: "Làm UI column + card",
          createdAt: "2025-11-19T08:15:00.000Z",
          description: "Dùng flex + gap + shadow cho card nhìn bớt phèn",
          priority: "Medium",
        },
        {
          id: "task-5",
          title: "Thêm filter priority",
          createdAt: "2025-11-19T09:00:00.000Z",
          description: "Filter theo high/medium/low ngay trên board bar",
          priority: "High",
        },
        {
          id: "task-6",
          title: "Tích hợp localStorage",
          createdAt: "2025-11-19T10:45:00.000Z",
          description: "Lưu trạng thái board để F5 không mất dữ liệu",
          priority: "High",
        },
      ],
    },

    "col-567890111": {
      id: "col-567890111",
      name: "Review",
      tasks: [
        {
          id: "task-7",
          title: "Review UX kéo thả",
          createdAt: "2025-11-20T07:30:00.000Z",
          description: "Check cảm giác drag & drop giữa các cột có mượt không",
          priority: "Medium",
        },
        {
          id: "task-8",
          title: "Tối ưu mobile",
          createdAt: "2025-11-20T08:10:00.000Z",
          description: "Test trên màn 390px, chỉnh lại padding/margin",
          priority: "Low",
        },
      ],
    },

    "col-999999999": {
      id: "col-999999999",
      name: "Done",
      tasks: [
        {
          id: "task-9",
          title: "Setup dự án với Vite + Tailwind",
          createdAt: "2025-11-17T13:00:00.000Z",
          description: "Tạo project, cấu hình alias @, thêm Tailwind",
          priority: "Low",
        },
        {
          id: "task-10",
          title: "Fix bug background input",
          createdAt: "2025-11-20T09:20:00.000Z",
          description: "Xóa background: none; trong global CSS để Tailwind bg ăn",
          priority: "High",
        },
      ],
    },
  },

  columnOrder: [
    "col-1235525234",
    "col-123552123",
    "col-567890111",
    "col-999999999",
  ],
};



const searchKeyword = ref('')
const filterPriority = ref('')
const showFilterModal = ref(false)
const isFilter = ref(false)
const selectColumn = ref(null)
const modalPosition = ref(null)
const selectTask = ref(null);
const selectTaskInColumnId = ref(null)

const boardData = useLocalStorage('boardData', )

// lọc dữ liệu
const filteredBoard = computed(() => {
  const key = searchKeyword.value.trim().toLowerCase();
  const pri = filterPriority.value.trim().toLowerCase();
  if (!key && !pri) return boardData.value;

  const bd = boardData.value;

  const newBoard = {
    columnOrder: [...bd.columnOrder],
    columns: {}
  };

  for (const colId of bd.columnOrder) {
    const col = bd.columns[colId];

    const filteredTasks = col.tasks.filter((task) => {
      const matchTitle = key
        ? task.title.toLowerCase().includes(key)
        : true;

      const matchPriority = pri
        ? task.priority.toLowerCase() === pri
        : true;

      return matchTitle && matchPriority;
    });

    newBoard.columns[colId] = {
      ...col,
      tasks: filteredTasks
    };
  }

  return newBoard;
});




// filter
const openFilterModal = (clickRect) => {
  if (!clickRect)
    return;
  showFilterModal.value = true
  modalPosition.value = { x: clickRect.x, y: clickRect.y }
}

const resetFilter = () => {
  searchKeyword.value = ''
  filterPriority.value = ''
  isFilter.value = false
}
const handleResetFilter = () => {
  resetFilter()
  closeFilterModal()
}
const handleApplyFilter = (inputKey, inputPriority) => {
  if (inputKey.trim() || inputPriority.trim()) {
    searchKeyword.value = inputKey.trim()
    filterPriority.value = inputPriority.trim()
    isFilter.value = true;
    closeFilterModal()
  } else {
    searchKeyword.value = ''
    filterPriority.value = ''
    isFilter.value = true;
    closeFilterModal()
  }
}
const closeFilterModal = () => {
  showFilterModal.value = false;
  modalPosition.value = null
}


// column
const openEditColumnModal = (column, clickRect) => {
  if (!column || !clickRect)
    return;
  selectColumn.value = column
  modalPosition.value = { x: clickRect.x, y: clickRect.y }
}


const handleDeleteColumn = (columnId) => {
  if (!columnId)
    return;
  delete boardData.value.columns[columnId];
  boardData.value.columnOrder = boardData.value.columnOrder.filter(
    (id) => id !== columnId
  );
  resetFilter();
  closeEditColumnModal();
  toast.success('Đã xóa cột')
}

const handleAddColumn = (columnName) => {
  if (!columnName)
    return;
  let columnId = `Column-${Date.now()}`;
  let newColumn = {
    id: columnId,
    name: columnName,
    tasks: []
  }
  boardData.value.columns[columnId] = newColumn;
  boardData.value.columnOrder.push(columnId);
  handleResetFilter();
  toast.success('Đã thêm cột')
}

const handleEditColumn = (newName, columnId) => {
  if (!newName.trim()) {
    return;
  }
  else if (!columnId.trim()) {
    toast.error('Đã có lỗi xảy ra!');
    return;
  }
  else {
    boardData.value.columns[columnId].name = newName;
    resetFilter()
    toast.success('Đã cật nhật thông tin cột')
  }
}

const closeEditColumnModal = () => {
  selectColumn.value = null
  modalPosition.value = null
}


// task
const openEditTaskModal = (task, columnId, clickRect) => {
  if (!task || !columnId || !clickRect)
    return;
  selectTask.value = task
  selectTaskInColumnId.value = columnId
  modalPosition.value = { x: clickRect.x, y: clickRect.y }
}

const handleAddTask = (taskTitle, columnId) => {
  if (!taskTitle || !columnId)
    return;
  let taskId = `Task-${Date.now()}`
  let newTask = {
    id: taskId,
    title: taskTitle,
    description: '',
    priority: 'Medium',
    createdAt: getLocalISOTime()
  }
  boardData.value.columns[columnId].tasks.push(newTask);
  resetFilter()
  toast.success('Đã thêm task')
}

const closeEditTaskModal = () => {
  selectTask.value = null;
  selectTaskInColumnId.value = null;
  modalPosition.value = null;
}

const handleDeleteTask = (taskId, columnId) => {
  if (!taskId || !columnId)
    return;
  boardData.value.columns[columnId].tasks = boardData.value.columns[columnId].tasks.filter((task) => task.id !== taskId);
  closeEditTaskModal()
  toast.success('Đã xóa tast')
}

const handleEditTask = (newTaskData, taskId, columnId) => {
  if (!newTaskData || !taskId || !columnId)
    return;
  const column = boardData.value.columns[columnId];
  if (!column) return;
  const task = column.tasks.find(t => t.id === taskId);
  if (task) {
    Object.assign(task, newTaskData);
    toast.success('Đã cật nhật thông tin task')
  }
}

// hàm xử lý kéo task
const onTaskDragEnd = (evt) => {
  const { from, to, oldIndex, newIndex } = evt
  if (!to || newIndex == null || newIndex === -1) return
  const fromColId = from.dataset.column
  const toColId = to.dataset.column
  // kéo thả task trong cùng 1 cột
  if (fromColId == toColId) {
    // vẫn vị trí cũ --> không làm gì
    if (oldIndex === newIndex)
      return;
    const tasks = boardData.value.columns[fromColId]?.tasks
    // nếu đang lọc dữ liệu -->
    // từ dữ liệu đã lọc tìm ra vị trí thật sự trong dữ liệu gốc.-->
    // thay đổi dữ liệu gốc
    if (isFilter.value) {
      const column = boardData.value.columns[fromColId]
      if (!column) return
      const allTasks = column.tasks
      const filteredColumn = filteredBoard.value.columns[fromColId]
      if (!filteredColumn) return
      const visibleTasks = filteredColumn.tasks
      if (!visibleTasks?.length) return
      const visibleIds = visibleTasks.map((t) => t.id)
      const newVisibleIds = [...visibleIds]
      const [movedId] = newVisibleIds.splice(oldIndex, 1)
      newVisibleIds.splice(newIndex, 0, movedId)
      const idToTask = allTasks.reduce((acc, task) => {
        acc[task.id] = task
        return acc
      }, {})
      const visibleIdSet = new Set(visibleIds)
      const newTasks = []
      let visiblePtr = 0
      for (const task of allTasks) {
        if (!visibleIdSet.has(task.id)) {
          newTasks.push(task)
        } else {
          const nextId = newVisibleIds[visiblePtr++]
          newTasks.push(idToTask[nextId])
        }
      }
      column.tasks = newTasks
    }
    // thay đổi dữ liệu gốc
    else {
      const [movedTask] = tasks.splice(oldIndex, 1)
      tasks.splice(newIndex, 0, movedTask)
    }
  }
  // kéo thả khác cột
  else {
    // nếu đang lọc dữ liệu -->
    // từ dữ liệu đã lọc tìm ra vị trí thật sự trong dữ liệu gốc.-->
    // thay đổi dữ liệu gốc
    if (isFilter.value) {
      const fromColumn = boardData.value.columns[fromColId]
      const toColumn = boardData.value.columns[toColId]
      if (!fromColumn || !toColumn) return
      const fromTasks = fromColumn.tasks
      const toTasks = toColumn.tasks
      const filteredFrom = filteredBoard.value.columns[fromColId]?.tasks || []
      const filteredTo = filteredBoard.value.columns[toColId]?.tasks || []
      const movedInFiltered = filteredFrom[oldIndex]
      if (!movedInFiltered) return
      const movedId = movedInFiltered.id
      const fromOriginalIndex = fromTasks.findIndex((t) => t.id === movedId)
      if (fromOriginalIndex === -1) return
      const [movedTask] = fromTasks.splice(fromOriginalIndex, 1)
      if (!movedTask) return
      let insertIndex
      if (filteredTo.length === 0) {
        insertIndex = toTasks.length
      } else if (newIndex === 0) {
        const firstVisibleId = filteredTo[0].id
        const firstVisibleIndex = toTasks.findIndex((t) => t.id === firstVisibleId)
        insertIndex = firstVisibleIndex === -1 ? toTasks.length : firstVisibleIndex
      } else {
        const prevVisible =
          filteredTo[Math.min(newIndex - 1, filteredTo.length - 1)]
        const prevIndex = toTasks.findIndex((t) => t.id === prevVisible.id)
        insertIndex = prevIndex === -1 ? toTasks.length : prevIndex + 1
      }
      toTasks.splice(insertIndex, 0, movedTask)
    }
    // thay đổi dữ liệu gốc
    else {
      const fromTasks = boardData.value.columns[fromColId].tasks
      const toTasks = boardData.value.columns[toColId].tasks
      const [movedTask] = fromTasks.splice(oldIndex, 1)
      toTasks.splice(newIndex, 0, movedTask)

    }
  }

}
</script>

<template>
  <BoardBar :isFilter="isFilter" @openFilterModal="openFilterModal" :showFilterModal="showFilterModal" />
  <div class="flex gap-6 h-[calc(100vh-120px)] overflow-x-auto px-8 overflow-y-hidden py-4">
    <draggable v-model="boardData.columnOrder" handle=".column-drag-area" group="columns" :item-key="(colId) => colId"
      direction="horizontal" :animation="200" :easing="'cubic-bezier(0.22, 1, 0.36, 1)'" ghost-class="column-ghost"
      chosen-class="column-chosen" drag-class="column-dragging" :swap-threshold="0.3" filter=".no-drag"
      :prevent-on-filter="false" class="flex gap-6">
      <template #item="{ element: colId }">
        <Column :column="filteredBoard.columns[colId]" :selectColumnId="selectColumn?.id"
          @openEditColumnModal="openEditColumnModal">
          <draggable :model-value="filteredBoard.columns[colId].tasks" group="tasks" item-key="id" :data-column="colId"
            :animation="180" :easing="'cubic-bezier(0.22, 1, 0.36, 1)'" ghost-class="task-ghost"
            chosen-class="task-chosen" drag-class="task-dragging" item-class="task-wrapper"
            class="flex flex-col gap-3 max-h-[calc(100vh-400px)] overflow-y-auto overflow-x-hidden px-4 pt-2 custom-scrollbar"
            @end="onTaskDragEnd">
            <template #item="{ element }">
              <Task :task="element" :columnId="colId" :editingTaskId="selectTask?.id"
                @openEditTaskModal="openEditTaskModal" />
            </template>
          </draggable>
          <div class="px-4">
            <AddTask :columnId="colId" @handleAddTask="handleAddTask" />
          </div>
        </Column>
      </template>
    </draggable>
    <AddColumn @handleAddColumn="handleAddColumn" />
  </div>
  <Transition name="column-modal">
    <ModalEditColumn v-if="selectColumn && modalPosition" :selectColumn="selectColumn" :modalPosition="modalPosition"
      @closeEditColumnModal="closeEditColumnModal" @handleDeleteColumn="handleDeleteColumn"
      @handleEditColumn="handleEditColumn" />
  </Transition>

  <ModalEditTask v-if="selectTask && selectTaskInColumnId && modalPosition" :selectTaskInColumnId="selectTaskInColumnId"
    :selectTask="selectTask" :modalPosition="modalPosition" @closeEditTaskModal="closeEditTaskModal"
    @handleDeleteTask="handleDeleteTask" @handleEditTask="handleEditTask" />

  <Transition name="filter-modal">
    <ModalFilter v-if="showFilterModal && modalPosition" :modalPosition="modalPosition" :keyWord="searchKeyword"
      :priority="filterPriority" @handleApplyFilter="handleApplyFilter" @handleResetFilter="handleResetFilter"
      @closeFilterModal="closeFilterModal" />
  </Transition>

</template>
<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #79aafc;
  border-radius: 6px;
}


/* Bóng còn lại trong list khi đang kéo */
.column-ghost {
  opacity: 0.6;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

/* Cột đang được kéo */
.column-chosen {
  z-index: 20;
}

/* Cursor khi đang kéo */
.column-dragging {
  cursor: grabbing !important;
}

/* ========== TASK DND ========== */

/* thằng bọc ngoài mỗi task */
.task-wrapper {
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
}

/* bóng còn lại trong list khi kéo – chỉ mờ nhẹ thôi */
.task-ghost {
  opacity: 0.85;
  /* trước là 0.4, giờ cho rõ lên */
  transform: scale(0.99);
}

/* task đang bị kéo – nhìn rõ 100% */
.task-chosen {
  opacity: 0.8;
  /* đảm bảo không bị mờ */
  transform: scale(1.02) translateY(-1px);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.25);
  z-index: 20;
}

.task-dragging {
  cursor: grabbing !important;
}
</style>
