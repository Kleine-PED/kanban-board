import React, { useState } from "react";
import logo from "../assets/chart-simple-solid.svg";
import iconDown from "../assets/chevron-down-solid.svg";
import iconUp from "../assets/chevron-up-solid.svg";
import iconElipsis from "../assets/icon-vertical-ellipsis.svg";
import HeaderDropdown from "./HeaderDropdown";
import AddEditBoardModal from "../modals/AddEditBoardModal";
import { useDispatch, useSelector } from "react-redux";
import AddEditTaskModal from "../modals/AddEditTaskModal";
import ElipsisMenu from "./ElipsisMenu";
import DeleteModal from "../modals/DeleteModal";
import boardsSlice from "../redux/boardSlice";
function Header({ setBoardModalOpen, boardModalOpen }) {
  const dispatch = useDispatch();

  const [openDropdown, setOpenDropdown] = useState(false);
  const [openAddEditTask, setOpenAddEditTask] = useState(false);
  const [isElipsisIsOpen, setIsElipsisIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [boardType, setBoardType] = useState("add");

  const boards = useSelector((state) => state.boards);
  const board = boards.find((board) => board.isActive);

  const setOpenEditModal = () => {
    setBoardModalOpen(true);
    setIsElipsisIsOpen(false);
  };
  const setOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setIsElipsisIsOpen(false);
  };

  const onDeleteBtnClick = () => {
    dispatch(boardsSlice.actions.deleteBoard());
    dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));
    setIsDeleteModalOpen(false);
  };

  const onDropdownClick = () => {
    setOpenDropdown((state) => !state);
    setIsElipsisIsOpen(false);
    setBoardType("add");
  };

  return (
    <div className="p-4 fixed left-0 bg-white dark:bg-[#2b2c37] z-50 right-0">
      <header className="flex justify-between  dark:text-white items-center ">
        {/* Left side */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <img src={logo} alt="logo" className="h-6 w-6" />
          <h3 className="hidden md:inline-block font-bold font-sans md:text-4xl">
            Kanban
          </h3>
          <div className="flex items-center">
            <h3 className="truncate max-w-[200px] md:text-2xl text-xl font-bold md:ml-20 font-sans">
              {board.name}
            </h3>
            <img
              src={openDropdown ? iconUp : iconDown}
              alt="dropdown icon"
              className="w-3 ml-2 md:hidden"
              onClick={onDropdownClick}
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex space-x-4 items-center md:space-x-6">
          <button
            className="button hidden md:block"
            onClick={() => {
              setOpenAddEditTask((state) => !state);
            }}
          >
            + Add New Task
          </button>

          <button
            className="button py-1 px-3 md:hidden"
            onClick={() => {
              setOpenAddEditTask((state) => !state);
            }}
          >
            +
          </button>
          <img
            src={iconElipsis}
            alt="elipsis icon"
            className="cursor-pointer h-6"
            onClick={() => {
              setBoardType("edit");
              setOpenDropdown(false);
              setIsElipsisIsOpen((state) => !state);
            }}
          />
          {isElipsisIsOpen && (
            <ElipsisMenu
              type="Boards"
              setOpenEditModal={setOpenEditModal}
              setOpenDeleteModal={setOpenDeleteModal}
            />
          )}
        </div>
      </header>

      {openDropdown && (
        <HeaderDropdown
          setOpenDropdown={setOpenDropdown}
          setBoardModalOpen={setBoardModalOpen}
        />
      )}
      {boardModalOpen && (
        <AddEditBoardModal
          setBoardModalOpen={setBoardModalOpen}
          type={boardType}
        />
      )}

      {openAddEditTask && (
        <AddEditTaskModal
          device="mobile"
          type="add"
          setOpenAddEditTask={setOpenAddEditTask}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          onDeleteBtnClick={onDeleteBtnClick}
          type="board"
          title={board.name}
        />
      )}
    </div>
  );
}

export default Header;
