import { useCallback } from "react";

export const useColumn = (setBoardData) => {
  const addColumn = useCallback(
    (columnTitle) => {
      const columnId = crypto.randomUUID();
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
        columnOrder: [...prev.columnOrder, columnId],
      }));
    },

    [setBoardData]
  );

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

  return {
    addColumn,
    deleteColumn,
  };
};
