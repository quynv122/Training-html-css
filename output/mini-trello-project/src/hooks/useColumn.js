import { useCallback } from "react";

export const useColumn = (setBoardData) => {

  // thêm column mới
  const addColumn = useCallback(
    (columnTitle) => {
      const columnId = `Column-${Date.now()}`;
      setBoardData((prev) => ({
        ...prev,
        columns: {
          ...prev.columns,
          [columnId]: {
            title: columnTitle,
            id: columnId,
            taskIds: [],
          },
        },
        columnOrder: [...(prev.columnOrder || ""), columnId],
      }));
    },
    [setBoardData]
  );

  // xóa column
  const deleteColumn = useCallback(
    (columnId) => {
      setBoardData((prev) => {
        const { [columnId]: deletedColumn, ...remainingColumns } = prev.columns;
        const remainingTasks = { ...prev.tasks };
        deletedColumn.taskIds.forEach((taskId) => {
          delete remainingTasks[taskId];
        });
        const newColumnOrder = prev.columnOrder.filter((id) => id !== columnId);
        return {
          ...prev,
          tasks: remainingTasks,
          columns: remainingColumns,
          columnOrder: newColumnOrder,
        };
      });
    },
    [setBoardData]
  );

  // cật nhật thông tin column
  const updateColumn = useCallback(
    (newColumn, columnId) => {
      setBoardData((prev) => ({
        ...prev,
        columns: {
          ...prev.columns,
          [columnId]: {
            ...prev.columns[columnId],
            ...newColumn,
          },
        },
      }));
    },
    [setBoardData]
  );

  return {
    addColumn,
    deleteColumn,
    updateColumn,
  };
};
