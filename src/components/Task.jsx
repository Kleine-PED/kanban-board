import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import TaskModal from "../modals/TaskModal";
function Task({ taskIndex, colIndex }) {
  const boards = useSelector((state) => state.boards);
  const board = boards.find((board) => board.isActive === true);
  const columns = board.columns;
  const col = columns.find((col, i) => i === colIndex);
  const task = col.tasks.find((task, i) => i === taskIndex);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    console.log("isTaskModalOpen changed:", isTaskModalOpen);
  }, [isTaskModalOpen]);
  useEffect(() => {
    console.log("Modal component re-rendered");
  });
  let completed = 0;
  let subtasks = task.subtasks;
  subtasks.forEach((subtask) => {
    if (subtask.isCompleted) {
      completed++;
    }
  });

  const handleOnDrag = (e) => {
    e.dataTransfer.setData(
      "text",
      JSON.stringify({ taskIndex, prevColIndex: colIndex })
    );
  };

  return (
    <div
      onClick={() => {
        setIsTaskModalOpen(true);
      }}
      onDragStart={handleOnDrag}
      draggable
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
