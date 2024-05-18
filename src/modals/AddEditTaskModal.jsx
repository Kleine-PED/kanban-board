import React, { useState } from "react";
import crossIcon from "../assets/icon-cross.svg";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import boardsSlice from "../redux/boardSlice";
function AddEditTaskModal({
  type,
  device,
  setIsTaskModalOpen,
  setIsAddTaskModalOpen,
  prevColIndex = 0,
  taskIndex,
}) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isValid, setIsValid] = useState(true);

  const board = useSelector((state) => state.boards).find(
    (board) => board.isActive
  );

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const columns = board.columns;
  const col = columns.find((col, index) => index === prevColIndex);

  const task = col ? col.tasks.find((task, idx) => idx === taskIndex) : [];

  const [status, setStatus] = useState(columns[prevColIndex].name);
  const [newColIndex, setNewColIndex] = useState(prevColIndex);

  const [subtasks, setSubtasks] = useState([
    { title: "", isCompleted: false, id: uuidv4() },
    { title: "", isCompleted: false, id: uuidv4() },
  ]);

  if (type === "edit" && isFirstLoad) {
    setSubtasks(
      task.subtasks.map((subtask) => {
        return { ...subtask, id: uuidv4() };
      })
    );
    setTitle(task.title);
    setDescription(task.description);
    setIsFirstLoad(false);
  }

  const onChange = (id, newValue) => {
    setSubtasks((pervState) => {
      const newState = [...pervState];
      const subtask = newState.find((subtask) => subtask.id === id);
      subtask.title = newValue;
      return newState;
    });
  };

  const onDelete = (id) => {
    setSubtasks((perState) => perState.filter((item) => item.id !== id));
  };

  const onSubmit = (type) => {
    if (type === "add") {
      dispatch(
        boardsSlice.actions.addTask({
          title,
          description,
          subtasks,
          status,
          newColIndex,
        })
      );
    } else {
      dispatch(
        boardsSlice.actions.editTask({
          title,
          description,
          subtasks,
          status,
          taskIndex,
          prevColIndex,
          newColIndex,
        })
      );
    }
  };

  const onChangeStatus = (e) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };

  const validate = () => {
    setIsValid(false);
    if (!title.trim()) {
      return false;
    }

    for (let i = 0; i < subtasks.length; i++) {
      if (!subtasks[i].title.trim()) {
        return false;
      }
    }

    setIsValid(true);
    return true;
  };

  return (
    <div
      className={`py-6 px-6 pb-40 absolute overflow-y-scroll left-0 right-0 ${
        device === "mobile" ? "bottom-[-100vh]" : "bottom-0"
      } top-0 flex bg-[#00000080]`}
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setIsAddTaskModalOpen(false);
      }}
    >
      {/* --- Modal Section--- */}
      <div className="scrollbar-hide overflow-y-scroll max-h-[95vh] my-auto bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl">
        <h3 className="text-lg">{type === "edit" ? "Edit" : "Add New"} Task</h3>
        {/* Task Name */}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm dark:text-white text-gray-500">
            Task Name
          </label>
          <input
            type="text"
            placeholder="e.g Take coffee break"
            className="bg-transparent px-4 py-2 outline-none focus:border-0 rounded-md text-sm border border-gray-600 focus:outline-[#4566e8] ring-0"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {/* Description */}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm dark:text-white text-gray-500">
            Description
          </label>
          <textarea
            type="text"
            placeholder="e.g It's always good to take a break. This 15 minute break will recharge the batteries a little"
            className="bg-transparent px-4 py-2 min-h-[200px] outline-none focus:border-0 rounded-md text-sm border border-gray-600 focus:outline-[#4566e8] ring-0 text-left align-top"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Subtasks Section */}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm dark:text-white text-gray-500">
            Subtasks
          </label>
          {subtasks.map((subtask, index) => {
            return (
              <div key={index} className="flex items-center w-full">
                <input
                  type="text"
                  placeholder="e.g Take coffee break"
                  className="bg-transparent px-4 py-2 flex-grow outline-none focus:border-0 rounded-md text-sm border border-gray-600 focus:outline-[#4566e8] ring-0"
                  value={subtask.title}
                  onChange={(e) => onChange(subtask.id, e.target.value)}
                />
                <img
                  src={crossIcon}
                  alt="icon x"
                  className="cursor-pointer m-4"
                  onClick={() => {
                    onDelete(subtask.id);
                  }}
                />
              </div>
            );
          })}

          <button
            className="w-full items-center dark:text-[#4566e8] text-white dark:bg-white bg-[#4566e8] py-2 rounded-full"
            onClick={() => {
              setSubtasks((state) => [
                ...state,
                { title: "", isCompleted: false, id: uuidv4() },
              ]);
            }}
          >
            + Add New Subtask
          </button>
        </div>

        {/* Current Status Section */}
        <div className="mt-8 flex flex-col space-y-3">
          <label className="text-sm dark:text-white text-slate-500">
            Current Status
          </label>
          <select
            className="select-status  flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0 border border-gray-300 focus:outline-[#4566e8] outline-none"
            value={status}
            onChange={onChangeStatus}
          >
            {columns.map((column, index) => (
              <option
                value={column.name}
                key={index}
                className="dark:text-gray-600"
              >
                {column.name}
              </option>
            ))}
          </select>

          <button
            className="w-full items-center  text-white  bg-[#4566e8] py-2 rounded-full"
            onClick={() => {
              const isValid = validate();
              if (isValid) {
                onSubmit(type);
                setIsAddTaskModalOpen(false);
              }
            }}
          >
            {type === "edit" ? "Save Edit" : "Create task"}
          </button>
        </div>
      </div>
    </div>
  );
}
// //{
//     device === "mobile"
//     ? "py-6 px-6 pb-40 absolute overflow-y-scroll left-0 right-0 bottom-[-100vh] top-0 flex bg-[#00000080]"
//     : "py-6 px-6 pb-40 absolute overflow-y-scroll left-0 right-0 bottom-0 top-0 flex bg-[#00000080] "
// }
export default AddEditTaskModal;
