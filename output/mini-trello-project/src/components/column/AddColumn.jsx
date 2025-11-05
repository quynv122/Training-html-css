import { useContext, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { BoardContext } from "../../contexts/boardContext";

const AddColumn = () => {

  const { handleAddColumn } = useContext(BoardContext);

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [activeSubmit, setActiveSubmit] = useState(true);

  // active nút thêm task khi nhập title
  useEffect(() => {
    if (title.trim()) {
      setActiveSubmit(false);
    } else {
      setActiveSubmit(true);
    }
  }, [title]);

  // xử lý khi submit
  const handleSubmit = () => {
    if (title.trim()) handleAddColumn(title.trim());
    setTitle('')
    handleClose;
  };

  // xử lý khi cancel
  const handleClose = () =>{
    setIsAdding(false);
    setTitle("");
  }

  if (!isAdding) {
    return (
      <button
        onClick={() => {
          setIsAdding(true);
        }}
        className="bg-[rgb(59,209,147)] hover:bg-[rgb(34,126,89)] dark:hover:bg-[rgb(2,119,72)] dark:bg-[rgb(19,70,49)] dark:border-white  text-black dark:text-white 
        rounded-lg p-2 w-80 flex-shrink-0 transition-all flex items-center justify-center gap-2 border border-black h-fit"
      >
        <Plus size={20} />
        <span className="font-medium">Thêm cột mới</span>
      </button>
    );
  }

  return (
    <div
      className="bg-[rgb(59,209,147)] dark:bg-[rgb(19,70,49)] border border-black
    rounded-xl p-4 w-80 flex-shrink-0 h-fit text-black dark:text-white"
    >
      <label className=" mb-2 block text-lg font-medium">Tên cột</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="VD: Đang Review..."
        className="w-full px-3 py-2 border text-black  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-500 text-sm"
        autoFocus
      />
      <div className="flex gap-2 mt-3 ">
        <button
          disabled={activeSubmit}
          onClick={handleSubmit}
          className="flex-1 px-4 py-2   border-black text-sm font-medium rounded-md  transition-colors
           disabled:cursor-not-allowed border disabled:bg-transparent  dark:border-white dark:bg-[rgb(19,70,49)]"
        >
          Thêm
        </button>
        <button
          onClick={handleClose}
          className="px-4 py-2 border border-black dark:border-white   dark:bg-[rgb(19,70,49)]  text-sm font-medium rounded-md  transition-colors"
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

export default AddColumn;
