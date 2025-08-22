import { AnimatePresence, motion } from "motion/react";
import AddNewItem from "./addNewItem";
import ListItem from "./ListItem";

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
  return (
    <div
      className={`m-4 h-min rounded-md group shadow shadow-black z-50 ${bgColors[bgColor]}`}
    >
      <div className="flex flex-col z-50">
        <div className="px-4 z-50 py-2 flex flex-row justify-between items-center">
          <div>{header}</div>
          <div>
            {addSection && (
              <div className="z-50">
                <AddNewItem taskList={taskList} setTasks={setTasks} />
              </div>
            )}
          </div>
        </div>
        <AnimatePresence>
          {taskList
            .filter((task) => task.status === status)
            .map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 2 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <ListItem
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
  );
}
