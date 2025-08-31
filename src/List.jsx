import { AnimatePresence, motion } from "motion/react";
import AddNewItem from "./AddNewItem";
import ListItem from "./ListItem";
import { useDroppable } from "@dnd-kit/core";

export default function List({
  bgColor,
  header,
  status,
  addSection,
  taskList,
  setTasks,
}) {
  const bgColors = {
    red: "bg-red-600",
    blue: "bg-blue-600",
    green: "bg-green-600",
  };
  const { setNodeRef } = useDroppable({ id: status });
  return (
    <div>
      <div
        ref={setNodeRef}
        className={`m-4 h-min rounded-md group shadow shadow-black z-0 ${bgColors[bgColor]}`}
      >
        <div className="flex flex-col">
          <div className="px-4 py-2 flex flex-row justify-between items-center">
            <div>{header}</div>
            {addSection && (
              <AddNewItem taskList={taskList} setTasks={setTasks} />
            )}
          </div>
          <AnimatePresence>
            {taskList
              .filter((task) => task.status === status)
              .map((task) => (
                <motion.div
                  className="z-100"
                  layout
                  key={task.id}
                  initial={{ opacity: 0, y: -2 }}
                  animate={{ opacity: 1, y: 2 }}
                  exit={{ opacity: 0, y: 2 }}
                >
                  <ListItem
                    isWeeklyView={false}
                    key={task.id}
                    task={task}
                    setTasks={setTasks}
                    taskList={taskList}
                  />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
