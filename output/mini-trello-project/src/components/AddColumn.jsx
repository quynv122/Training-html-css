import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useContext } from "react";
import { BoardContext } from "../contexts/BoardContext";

const AddColumn = () => {
  const { handleAddColumn } = useContext(BoardContext);
  const [isOpen, setIsOpen] = useState(false);
  const [columnName, setColumnName] = useState("");

  const handleClose = () => {
    setIsOpen(false);
    setColumnName("");
  };

  const handleSubmit = () => {
    if (columnName.trim()) {
      handleAddColumn(columnName.trim());
      handleClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      handleClose();
    }
  };

  return (
    <>
      {isOpen ? (
        <div>
          <div
            className="shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(255,255,255,0.3)] 
            rounded-lg p-4 w-[280px] animate-in fade-in border border-gray-400  dark:border-white
            slide-in-from-top-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              placeholder="Nhập tên danh sách..."
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
              className="w-full px-3 py-2  border-2 border-black text-black focus:border-blue-500 
             focus:dark:border-blue-500
              rounded-lg outline-none mb-3"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                Thêm danh sách
              </button>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-slate-300 tex-black
                dark:text-white hover:dark:bg-slate-700
                 transition-colors"
              >
                <X className="w-5 h-5 " />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          
          className="min-w-[280px] w-[280px]"
        >
          <button
          onClick={() => {
            setIsOpen(true);
          }}
           className="w-full h-fit bg-white dark:bg-black dark:border-white border border-black 
          transition-all duration-200 group cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.15)] 
          dark:shadow-[0_20px_50px_rgba(255,255,255,0.3)] rounded-xl hover:dark:bg-slate-700
          hover:bg-slate-300 text-black dark:text-white
          ">
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 rounded-lg">
                <Plus strokeWidth={2.5} className=" w-5 h-5" />
              </div>
              <span className="font-semibold transition-colors">
                Thêm danh sách
              </span>
            </div>
          </button>
        </div>
      )}
    </>
  );
};

export default AddColumn;
