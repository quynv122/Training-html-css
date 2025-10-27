import { useTheme } from "../../hooks/useTheme";
import { Moon, Sun } from "lucide-react";

const ToggleTheme = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-4 py-2 rounded-xl
                 border border-black bg-white text-black
                 dark:border-white dark:bg-black dark:text-white
                 hover:bg-gray-200 dark:hover:bg-gray-800
                 transition-colors duration-200"
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
};

export default ToggleTheme;
