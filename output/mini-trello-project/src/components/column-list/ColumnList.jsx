
import AddColumn from "../column/AddColumn";
import Column from "../column/Column";
import {SortableContext,
    horizontalListSortingStrategy
} from '@dnd-kit/sortable';

const ColumnList = ({ columns, tasks, columnOrder }) => {
  return (
    <SortableContext
      items={columnOrder} 
      strategy={horizontalListSortingStrategy}
    >
      <div className="flex gap-12 pt-3">
        {columnOrder.map((columnId) => {
          const column = columns[columnId];
          const columnTasks = column.taskIds.map((taskId) => tasks[taskId]);
          return (
            <Column key={column.id} column={column} columnTasks={columnTasks} />
          );
        })}
        <AddColumn/>
      </div>
    </SortableContext>
  );
};

export default ColumnList;
