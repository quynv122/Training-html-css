import AddColumn from "../column/AddColumn";
import Column from "../column/Column";
import { Droppable, Draggable } from "@hello-pangea/dnd";

const ColumnList = ({ columns, tasks, columnOrder }) => {
  return (
    <Droppable droppableId="board" direction="horizontal" type="COLUMN">
      {(provided,) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className='inline-flex pt-3  '
        >
          {columnOrder.map((columnId, index) => {
            const column = columns[columnId];
            const columnTasks = column.taskIds.map((taskId) => tasks[taskId]);
            return (
              <Draggable key={column.id} draggableId={column.id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    style={{
                      ...dragProvided.draggableProps.style,
                      opacity: dragSnapshot.isDragging ? 0.7: 1,
                    }}
                  >
                    <Column
                      column={column}
                      columnTasks={columnTasks}
                      dragHandleProps={dragProvided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
          <AddColumn />
        </div>
      )}
    </Droppable>
  );
};

export default ColumnList;
