import { AnimatePresence, motion } from "motion/react";
import type { Task } from "./taskDb";
import KanbanTask from "./KanbanTask";
import { db } from "./taskDb";
import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
export default function Kanban() {
  const rawTasks = useLiveQuery(() => db.tasks.toArray()) || [];
  const tasks: Task[] = useMemo(() => rawTasks, [rawTasks]);

  /* droppable areas için olan kodlar */
  const { setNodeRef: setTodoDroppableRef } = useDroppable({
    id: "droppable-todo",
  });
  const { setNodeRef: setInprogressDroppableRef } = useDroppable({
    id: "droppable-inprogress",
  });
  const { setNodeRef: setDoneDroppableRef } = useDroppable({
    id: "droppable-done",
  });
  /* bugün */
  const today = new Date();
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="px-5 py-10">
          <div className="md:grid md:grid-cols-3 flex flex-row gap-3 overflow-auto w-full font-header">
            <div
              ref={setTodoDroppableRef}
              className="bg-white/50 dark:bg-gray-950/50 w-full dark:text-white min-w-[10rem] z-10 backdrop-blur-2xl h-auto p-1.5 rounded-lg"
            >
              <div className="mb-1 p-1.5">To-Do</div>
              <div className="font-sans flex flex-col gap-2">
                {tasks
                  .filter((task: Task) => task.state === "todo")
                  .map((task: Task) => (
                    <motion.div key={task._id}>
                      <KanbanTask
                        isOverlay={false}
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

            <div
              ref={setInprogressDroppableRef}
              className="bg-white/50 dark:bg-gray-950/50 w-full dark:text-white min-w-[10rem] z-10 backdrop-blur-2xl h-auto p-1.5 rounded-lg"
            >
              <div className="mb-1 p-1.5">In Progress</div>
              <div className="font-sans flex flex-col gap-2">
                {tasks
                  .filter((task: Task) => task.state === "inProgress")
                  .map((task: Task) => (
                    <motion.div key={task._id}>
                      <KanbanTask
                        isOverlay={false}
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

            <div
              ref={setDoneDroppableRef}
              className="bg-white/50 dark:bg-gray-950/50 w-full dark:text-white min-w-[10rem] z-10 backdrop-blur-2xl h-auto p-1.5 rounded-lg"
            >
              <div className="mb-1 p-1.5">Done</div>
              <div className="font-sans flex flex-col gap-2">
                {tasks
                  .filter(
                    (task: Task) =>
                      task.state === "done" && task.dueDate < today
                  )
                  .map((task: Task) => (
                    <motion.div key={task._id}>
                      <KanbanTask
                        isOverlay={false}
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
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
