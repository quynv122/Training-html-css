import { useState, useEffect, useCallback } from "react";

function useLocalStorage(key, initialValue) {
  
  const readValue = useCallback(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }
      const parsed = JSON.parse(item);
      return parsed ?? initialValue;
    } catch (error) {
      console.error("Lỗi đọc localStorage:", error);
      return initialValue;
    }
  }, [key]); 

  const [storedValue, setStoredValue] = useState(readValue);

  //  Hàm setValue
  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error("Lỗi ghi localStorage:", error);
      }
    },
    [key, storedValue]
  );

  //  Chỉ sync khi localStorage thay đổi 
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key) setStoredValue(readValue());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, readValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;
