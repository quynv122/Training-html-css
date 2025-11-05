import { useEffect, useState } from "react";
import ToggleTheme from "./ToggleTheme";
import { X, Search } from "lucide-react";

const BoardBar = ({ onSearch, onFilter, currentKey, currentPriority }) => {
  const [priority, setPriority] = useState(currentPriority);
  const [keyWord, setKeyWord] = useState(currentKey);
  const [activeBtn, setActiveBtn] = useState(true);

  useEffect(() => {
    if (keyWord.trim()) {
      setActiveBtn(false);
    } else {
      setActiveBtn(true);
    }
  }, [keyWord]);

  const handleChangeKey = (keyWord) => {
    setKeyWord(keyWord);
  };

  const handleSubmit = () => {
    if (keyWord.trim()) onSearch(keyWord);
  };

  const handlePressKey = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleClearSearch = () => {
    if (keyWord.trim()) setKeyWord("");
    onSearch("");
  };  

  const handleChangeFilter = (e) => {
    setPriority(e.target.value);
    onFilter(e.target.value);
  };


  return (
    <>
      <div className="board-bar px-2 h-[4rem] sm:px-12 flex items-center justify-between bg-[rgba(255,255,255,0.3)] dark:bg-[rgba(0,0,0,0.7)] text-black">
        <div className="flex items-center justify-between h-[40px] gap-3">
          <select
            value={priority}
            onChange={handleChangeFilter}
            className="px-2 sm:px-4 h-full font-semibold rounded-lg text-white bg-[rgb(11,74,48)] focus:outline-none focus:ring-0 focus:border-transparent text-sm sm:text-base"
          >
            <option value="">All priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <div className="flex h-full ">
            <input
              type="text"
              value={keyWord}
              onChange={(e) => handleChangeKey(e.target.value)}
              onKeyDown={(e) => handlePressKey(e)}
              placeholder="Nhập để tìm kiếm..."
              className="px-2 h-full bg-white w-[150px] rounded-tl-lg rounded-bl-lg focus:outline-none focus:ring-0 focus:border-transparent flex-1 sm:flex-initial sm:w-auto text-sm sm:text-base"
            />

            <div className="flex items-center h-full bg-white rounded-tr-lg rounded-br-lg">
              <button
                disabled={activeBtn}
                onClick={handleClearSearch}
                className="disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent border-r-2 border-black px-4 sm:px-3"
              >
                <X size={20} className="sm:w-6 sm:h-6 sm:hover:bg-gray-300" />
              </button>
              <button
                disabled={activeBtn}
                onClick={handleSubmit}
                className="disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent px-4 sm:px-3"
              >
                <Search
                  size={20}
                  className="sm:w-6 sm:h-6 sm:hover:bg-gray-300"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex">
          <ToggleTheme />
        </div>
      </div>

      <div
        className="sm:hidden fixed bottom-12 right-3 z-999 
        hover:scale-110 transition-transform duration-200
        drop-shadow-lg"
      >
        <ToggleTheme />
      </div>
    </>
  );
};

export default BoardBar;
