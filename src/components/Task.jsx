import React, { useState } from "react";
import { useSelector } from "react-redux";
import TaskModal from "../modals/TaskModal";
function Task({ taskIndex, colIndex }) {
  const boards = useSelector((state) => state.boards);
  const board = boards.find((board) => board.isActive);

  const columns = board.columns;
  const col = columns.find((col, idx) => idx === colIndex);
  const task = col.tasks.find((task, idx) => idx === taskIndex);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  let completed = 0;
  let subtasks = task.subtasks;
  subtasks.forEach((subtask) => {
    if (subtask.isCompleted) {
      completed++;
    }
  });
  return (
    <div
      onClick={() => {
        setIsTaskModalOpen(true);
      }}
    >
      <div className="w-[280px] first:my-5 rounded-lg bg-white dark:bg-[#2b2c37] shadow-[#364e7e1a] py-6 px-3 shadow-lg hover:text-[#4566e8] cursor-pointer dark:text-white">
        <p className="font-bold tracking-wide">{task.title}</p>
        <p className="font-bold text-xs tracking-lighter mt-2 text-gray-500">
          {completed} of {subtasks.length}completed tasks
        </p>
      </div>

      {isTaskModalOpen && (
        <TaskModal
          colIndex={colIndex}
          taskIndex={taskIndex}
          setIsTaskModalOpen={setIsTaskModalOpen}
        />
      )}
    </div>
  );
}

export default Task;