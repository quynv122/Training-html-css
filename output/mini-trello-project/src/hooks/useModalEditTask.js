import { useState } from 'react';

const useModalEditTask = () => {
  const [isShowingModalEditTask, setIsShowingModalEditTask] = useState(false);

  function toggleModalEditTask() {
    setIsShowingModalEditTask(!isShowingModalEditTask);
  }

  return {
    isShowingModalEditTask,
    toggleModalEditTask,
  }
};

export default useModalEditTask;
