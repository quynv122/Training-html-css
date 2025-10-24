import { useState } from 'react';

const useModalAddTask = () => {
  const [isShowingModalAddTask, setIsShowingModalAddTask] = useState(false);

  function toggleModalAddTask() {
    setIsShowingModalAddTask(!isShowingModalAddTask);
  }

  return {
    isShowingModalAddTask,
    toggleModalAddTask,
  }
};

export default useModalAddTask;
