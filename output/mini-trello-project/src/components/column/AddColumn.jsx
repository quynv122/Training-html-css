import { useState } from "react";
import { Plus } from "lucide-react";

const AddColumn = ({onAddColumn}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    if(title.trim())
      onAddColumn(title.trim())
      setIsAdding(false)
      setTitle('')
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="bg-white text-black dark:bg-black dark:text-white hover:bg-gray-300  rounded-lg p-2 w-80 flex-shrink-0 transition-all flex items-center
         justify-center gap-2 border border-black dark:border-white hover:dark:bg-gray-700 h-fit"
      >
        <Plus size={20} />
        <span className="font-medium">Thêm cột mới</span>
      </button>
    );
  }

  return (
    <div className="bg-white text-black dark:bg-black dark:text-white border border-black dark:border-white
    rounded-xl p-4 w-80 flex-shrink-0 h-fit">
      <label className=" mb-2 block text-lg font-medium">Tên cột</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="VD: Đang Review..."
        className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-500 text-sm"
        autoFocus
      />
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Thêm
        </button>
        <button
          onClick={() => {
            setIsAdding(false);
            setTitle('');
          }}
          className="px-4 py-2 border border-black dark:border-white hover:bg-gray-300 hover:dark:bg-gray-700   text-sm font-medium rounded-md  transition-colors"
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

export default AddColumn