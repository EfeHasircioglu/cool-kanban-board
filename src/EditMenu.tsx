import { useEffect, useState } from "react";
import useTasks from "./store";
import { motion } from "motion/react";
export default function EditMenu({ editFunction }: any) {
  const {
    editingTask,
    tempTitle,
    tempDesc,
    tempDate,
    setTempTitle,
    setTempDesc,
    setTempDate,
    setEditingTask,
    setIsEditOpen,
  }: any = useTasks();
  const [titleError, setTitleError] = useState<string>("");

  /* ilk başta fieldlerin doldurulması */
  useEffect(() => {
    if (editingTask) {
      setTempTitle(editingTask.title);
      setTempDesc(editingTask.description);
      setTempDate(editingTask.dueDate.toISOString().split("T")[0]);
    }

    return () => {
      setTempTitle("");
      setTempDesc("");
      setTempDate("");
    };
  }, [editingTask]);
  /* real time error setting */
  useEffect(() => {
    if (tempTitle.trim() === "") {
      setTitleError("Title is required");
    } else {
      setTitleError("");
    }
  }, [tempTitle]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col w-screen h-screen top-0 left-0 bg-gray-950/50 shadow-2xl dark:bg-gray-950/50 z-1000"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.9, rotateX: -10 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-[50%] h-[50½] bg-white/50 dark:bg-gray-950/50 backdrop-blur-2xl shadow-2xl rounded-lg m-auto max-w-[500px]"
      >
        <div className="py-2 px-3">
          <div>
            {" "}
            <div className="flex flex-row justify-between w-full mb-3">
              <div className="font-bold text-lg dark:text-white">Edit Task</div>
              <button
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingTask(undefined);
                }}
              >
                <svg
                  className="text-black dark:text-white dark:active:bg-white/15 dark:hover:bg-white/10 w-6 h-6 rounded-lg cursor-pointer active:bg-black/15 hover:bg-black/10 p-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <g fill="none" fillRule="evenodd">
                    <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                    <path
                      fill="currentColor"
                      d="m12 13.414l5.657 5.657a1 1 0 0 0 1.414-1.414L13.414 12l5.657-5.657a1 1 0 0 0-1.414-1.414L12 10.586L6.343 4.929A1 1 0 0 0 4.93 6.343L10.586 12l-5.657 5.657a1 1 0 1 0 1.414 1.414z"
                    />
                  </g>
                </svg>
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="text-sm ml-1 dark:text-white">Title</div>
              <input
                id="edit-title"
                className={`w-full bg-white/50 dark:text-white dark:bg-gray-950/50 backdrop-blur-2xl rounded-lg p-2 ${
                  titleError && "border-1 border-red-500"
                }`}
                type="text"
                value={tempTitle}
                onChange={(e) => {
                  setTempTitle(e.target.value);
                }}
              />
              {titleError && (
                <div className="text-xs text-red-500 font-bold">
                  {titleError}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm ml-1 dark:text-white">Description</div>
              <textarea
                id="edit-desc"
                className="w-full bg-white/50 dark:text-white dark:bg-gray-950/50 backdrop-blur-2xl rounded-lg p-2"
                value={tempDesc}
                onChange={(e) => {
                  setTempDesc(e.target.value.trim());
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm ml-1 dark:text-white">Due Date</div>
              <input
                id="edit-duedate"
                className="w-full bg-white/50 dark:text-white dark:bg-gray-950/50 backdrop-blur-2xl rounded-lg p-2"
                type="date"
                value={tempDate}
                onChange={(e) => {
                  setTempDate(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-row gap-1">
              <button
                onClick={() => {
                  if (tempTitle.trim() !== "") {
                    editFunction();
                    setIsEditOpen(false);
                    setEditingTask(undefined);
                  }
                }}
                className="bg-white/50 dark:bg-gray-950/50 dark:hover:bg-gray-950/30 dark:text-white hover:bg-white/30 py-2 rounded-lg cursor-pointer px-3"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
