import { useContext, useState, useEffect, useRef, useMemo } from "react";
import { getLocalISOTime } from "../../utils/Date";
import { BoardContext } from "../../contexts/boardContext";
import { createPortal } from "react-dom";
import { caculatePositionModal } from "../../utils/caculatePositionModal";

const ModalAddTask = ({ isOpen, columnId, rect }) => {
  
  const { handleAddTask, closeAddTask } = useContext(BoardContext);

  const [activeSubmit, setActiveSubmit] = useState(false);
  const modalRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  // tính vị trí hiển trị modal lên màn hình
  const position = useMemo(() => {
    return caculatePositionModal(
      { x: rect.x, y: rect.y },
      { width: 300, height: 250 }
    );
  }, [rect]);


  const handleSubmit = () => {
    if (title.trim()) {
      const newCard = {
        title: title,
        description: description,
        priority: priority,
        id: crypto.randomUUID(),
        createdAt: getLocalISOTime(),
      };
      handleAddTask(newCard, columnId);
    }
  };

  // đóng modal khi click ra ngoài modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeAddTask();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  // dựa vào input title để vô hiệu hóa nút thêm Card
   useEffect(()=>{
    if(title.trim())
      setActiveSubmit(true)
  },[title])



  if (!isOpen) return null;

  return createPortal(
    <div
      ref={modalRef}
      className="bg-[rgb(146,221,255)] dark:bg-[rgb(3,55,80)] border border-black text-black dark:text-white fixed z-50 w-[300px] h-[250px] animate-fadeIn
        will-change-transform p-4 rounded-lg shadow-sm"
      style={{
        top: `${position.top + 10}px`,
        left: `${position.left + 10}px`,
      }}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tiêu đề Card..."
        className="w-full px-3 text-black py-2 text-sm border border-black dark:border-none dark:focus:ring-yellow-500
          rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        autoFocus
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Mô tả chi tiết (không bắt buộc)"
        className="w-full px-3 py-2 text-sm border text-black border-black dark:border-none rounded-md mt-2 focus:outline-none   dark:focus:ring-yellow-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows="2"
      />

      <div className="mt-2">
        <label className="text-xs mb-1 block font-semibold">Độ ưu tiên</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full px-3 py-2 text-sm border text-black  border-black dark:border-none rounded-md focus:outline-none focus:ring-2  dark:focus:ring-yellow-500 focus:ring-blue-500"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="flex gap-2 mt-3">
        <button
         disabled={!activeSubmit}
          onClick={handleSubmit}
          className="flex-1 disabled:cursor-not-allowed
           disabled:bg-transparent hover:bg-[rgb(110,206,250)] dark:hover:bg-[rgb(2,119,72)] px-4 py-2 border border-black dark:border-white text-sm font-medium rounded-md  transition-colors"
        >
          Thêm
        </button>
        <button
          onClick={closeAddTask}
          className="px-4 py-2text-sm font-medium rounded-md border border-black dark:border-white hover:bg-[rgb(110,206,250)] dark:hover:bg-[rgb(2,119,72)] transition-colors"
        >
          Hủy
        </button>
      </div>
    </div>,
    document.body
  );
};

export default ModalAddTask;
