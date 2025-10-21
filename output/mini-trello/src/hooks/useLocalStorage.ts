import { useState, useEffect, useCallback } from "react";

/**
 * Hook quản lý state đồng bộ với localStorage.
 * Nếu truyền value => ghi.
 * Nếu không => đọc.
 * Tự động lưu + đọc lại khi tab khác thay đổi.
 */
function useLocalStorage<T>(key: string, initialValue?: T) {
  // 🧩 Lấy giá trị ban đầu từ localStorage
  const readValue = useCallback((): T | null => {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue ?? null;
    } catch (error) {
      console.error("❌ Lỗi đọc localStorage:", error);
      return initialValue ?? null;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T | null>(readValue);

  // 📝 Ghi vào localStorage mỗi khi giá trị thay đổi
  const setValue = useCallback(
    (value: T | ((val: T | null) => T)) => {
      try {
        const newValue = value instanceof Function ? value(storedValue) : value;
        setStoredValue(newValue);
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.error("❌ Lỗi ghi localStorage:", error);
      }
    },
    [key, storedValue]
  );

  // 🔁 Reload dữ liệu khi tab khác thay đổi localStorage
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        setStoredValue(readValue());
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, readValue]);

  return [storedValue, setValue] as const;
}

export default useLocalStorage;
