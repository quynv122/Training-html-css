import TaskCard from "../task-card/TaskCard";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  createdAt: string;
}

interface ColumnProps {
  title: string;
  tasks: Task[];
}

export default function Column({ title, tasks }: ColumnProps) {
  return (
    <div className="bg-white p-4 rounded-md shadow w-64">
      <h2 className="font-bold text-lg mb-3 text-gray-700">{title}</h2>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
    
    
  );
}
