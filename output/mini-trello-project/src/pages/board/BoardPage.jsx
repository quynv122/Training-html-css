import Column from "../../components/column/Column";
import { useContext } from "react";
import { BoardContext } from "../../contexts/BoardContext";

const BoardPage = () => {
  const { boardData } = useContext(BoardContext);
  return (
    <>
      {boardData?.columnOrder?.length
        ? boardData.columnOrder.map((colId) => {
            const column = boardData.columns[colId];
            const tasks = column.taskIds.map(
              (taskId) => boardData.tasks[taskId]
            );
            return <Column key={column.id} column={column} tasks={tasks} />;
          })
        : ""}
    </>
  );
};

export default BoardPage;
