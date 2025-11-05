import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";

const CustomToast = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkDevice = () => {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      setIsMobile(/Mobi|Android|iPhone|iPad|iPod/i.test(ua));
    };
    checkDevice();
  }, []);
  return (
    <ToastContainer
      position={isMobile ? "top-center" : "top-right"}
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      draggable
      pauseOnHover={false}
      limit={3}
      theme="colored"
      toastStyle={{
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: "14px",
        minWidth: "220px",
        maxWidth: "90vw",
      }}
    />
  );
};

export default CustomToast;
