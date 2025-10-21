import Column from "../../components/column/Column";
   import type { BoardData } from "../../types/board";

   interface BoardProps {
     data: BoardData;
   }    

export default function BoardPage({ data }: BoardProps) {
    

   
   
     return (
       <div className="flex gap-6 p-6 bg-slate-100 min-h-screen">
         {data.columnOrder.map((colId) => {
           const column = data.columns[colId];
           const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
   
           return <Column key={column.id} title={column.title} tasks={tasks} />;
         })}
         <div className="bg-white p-4 rounded-md shadow w-64 h-12 flex items-center justify-center">
           <h2 className="font-bold text-lg text-gray-700">Add col</h2>
         </div>
       </div>
     );
   }
