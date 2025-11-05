import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, Copy, Trash2 } from "lucide-react";
import { useContext } from "react";
import { BoardContext } from "../../contexts/boardContext";
import { caculatePositionModal } from "../../utils/caculatePositionModal";

function ModalEditColumn({ isOpen, column, rect }) {
  const { closeEditColumn, handleUpdateColumn, handleDeleteColumn } = useContext(BoardContext);

  const [title, setTitle] = useState(column.title);
  const [oldTitle, setOldTitle] = useState(column.title);
  const modalRef = useRef(null);

  // tính vị trí để hiển trị modal
  const position = useMemo(() => {
    return caculatePositionModal(
      { x: rect.x, y: rect.y },
      { width: 300, height: 250 }
    );
  }, [rect]);

 
  const onDeleTeColumn = () => {
    handleDeleteColumn(column.id);
    closeEditColumn();
  };

  const handleChangeTitle = () => {
    const newTitle = title.trim();
    if (newTitle) {
      handleUpdateColumn({ title: newTitle }, column.id);
    } else {
      setTitle(oldTitle);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") e.target.blur();
  };

  useEffect(() => {
    if (title) setOldTitle(title);
  }, [title]);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeEditColumn();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        ref={modalRef}
        className="fixed z-50 animate-fadeIn text-black dark:text-white
        will-change-transform bg-[rgb(146,221,255)]  dark:bg-[rgb(11,74,48)]
          rounded-lg shadow-2xl w-[300px] h-[250] overflow-hidden"
        style={{
          top: `${position.top + 20}px`,
          left: `${position.left}px`,
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 dark:border-gray-300">
          <h3 className="text-sm font-semibold ">
            Thao tác danh sách
          </h3>
          <button
            onClick={closeEditColumn}
            className=" hover:bg-gray-300  rounded transition-colors"
          >
            <X />
          </button>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <label
              htmlFor="columnName"
              className="block text-xs font-semibold mb-2"
            >
              Tên danh sách
            </label>
            <input
              id="columnName"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleChangeTitle}
              onKeyDown={handleKeyPress}
              className="w-full px-3 py-2  rounded-md 
                   text-sm text-black
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-all"
            />
          </div>
          <div className="border-t border-gray-700 dark:border-gray-300 my-3"></div>
          <ul className="space-y-1">
            <li>
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm 
                         hover:dark:bg-[rgb(47,138,100)] hover:bg-[rgb(110,206,250)]  rounded-md transition-colors text-left group"
              >
                <Copy />
                <span>Nhân đôi danh sách</span>
              </button>
            </li>

            <li>
              <button
                onClick={onDeleTeColumn}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 
                         hover:dark:bg-[rgb(47,138,100)] hover:bg-[rgb(110,206,250)]  rounded-md transition-colors text-left group"
              >
                <Trash2 />
                <span>Xóa danh sách</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>,
    document.body
  );
}

export default ModalEditColumn;
