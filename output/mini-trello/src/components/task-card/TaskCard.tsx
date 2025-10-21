interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  createdAt: string;
}

export default function TaskCard({ task }: { task: Task }) {
  const priorityColor =
    task.priority === "High"
      ? "bg-red-500"
      : task.priority === "Medium"
      ? "bg-yellow-400"
      : "bg-green-500";

  return (
    <div className="p-3 mb-3 bg-amber-50 rounded-lg border shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">{task.title}</h3>
        <span
          className={`text-xs text-white px-2 py-[2px] rounded ${priorityColor}`}
        >
          {task.priority}
        </span>
      </div>
      <p className="text-[10px] text-gray-400 mt-1">
        {new Date(task.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
