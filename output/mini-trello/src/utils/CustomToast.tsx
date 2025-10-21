import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const CustomToast: React.FC = () => {
    return (
      <ToastContainer
        position="top-right"           
        autoClose={3000}             
        hideProgressBar={false}       
        newestOnTop={false}            
        closeOnClick                 
        rtl={false}                   
        pauseOnFocusLoss              
        draggable                  
        pauseOnHover                
        theme="light"                 
        limit={1}             
      />
    );
  };
  
  export default CustomToast;