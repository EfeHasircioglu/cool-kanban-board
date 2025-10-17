import { AnimatePresence, motion } from "motion/react";
import type { Task } from "./taskDb";
import KanbanTask from "./KanbanTask";
import { db } from "./taskDb";
import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";
export default function Kanban() {
  const rawTasks = useLiveQuery(() => db.tasks.toArray()) || [];
  const tasks: Task[] = useMemo(() => rawTasks, [rawTasks]);
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="px-5 py-10">
          <div className="grid grid-cols-3 gap-3 w-full font-header">
            <div className="bg-[#fff1e6]/50 backdrop-blur-2xl h-auto p-1.5 rounded-lg">
              <div className="mb-1 p-1.5">To-Do</div>
              <div className="font-sans flex flex-col gap-2">
                {tasks.map((task: Task) => (
                  <motion.div key={task._id}>
                    <KanbanTask
                      key={task._id}
                      title={task.title}
                      date={task.dueDate}
                      description={task.description}
                      task={task}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="bg-[#fff1e6]/50 backdrop-blur-2xl h-min p-1.5 rounded-lg">
              <div className="mb-1 p-1.5">In Progress</div>
            </div>
            <div className="bg-[#fff1e6]/50 backdrop-blur-2xl h-min p-1.5 rounded-lg">
              <div className="mb-1 p-1.5">Done</div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
