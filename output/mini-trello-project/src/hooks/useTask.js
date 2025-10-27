
import { useCallback } from "react";

export const useTask = (setBoardData) => {
  const addTask = useCallback(
    (newTask, columnId) => {
      setBoardData((prev) => {
        
        if (!prev.columns[columnId]) return prev;

        return {
          ...prev,
          tasks: {
            ...prev.tasks,
            [newTask.id]: newTask, 
          },
          columns: {
            ...prev.columns,
            [columnId]: {
              ...prev.columns[columnId],
              taskIds: [...prev.columns[columnId].taskIds, newTask.id], 
            },
          },
        };
      });
    },
    [setBoardData]
  );

  const updateTask = useCallback(
    (newTask) => {
  setBoardData((prev) => {

    const newBoardData = {
      ...prev,
      tasks: {...prev.tasks,[newTask.id]:{...newTask}},
    };

    return newBoardData;
  });
},
    [setBoardData]
  );


  const deleteTask = useCallback(
    (taskId, columnId) => {
      setBoardData((prev) => {
        if (!prev.columns[columnId]) return prev;

        const newTaskIds = prev.columns[columnId].taskIds.filter(
          (id) => id !== taskId
        );


        const newTasks = { ...prev.tasks };
        delete newTasks[taskId];

        return {
          ...prev,
          tasks: newTasks,
          columns: {
            ...prev.columns,
            [columnId]: {
              ...prev.columns[columnId],
              taskIds: newTaskIds,
            },
          },
        };
      });
    },
    [setBoardData]
  );

  return {
    addTask,
    updateTask,
    deleteTask,
  };
};
