import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./taskDb";
import type { Task } from "./taskDb";
import { useMemo } from "react";
import { motion } from "motion/react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
export default function PastTasks() {
  const rawTasks = useLiveQuery(() => db.tasks.toArray()) || [];
  const tasks: Task[] = useMemo(() => rawTasks, [rawTasks]);
  const today = useMemo(() => new Date(), []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mt-6"
    >
      <div className="px-5 flex flex-col gap-2">
        {tasks
          .filter((tsk) => tsk.dueDate < today && tsk.state === "done")
          .map((t) => (
            <div
              className="flex flex-col gap-1 px-2 py-3 bg-white dark:bg-gray-950 dark:text-white rounded-2xl shadow-2xl"
              key={t._id}
            >
              <div>{t.title}</div>
              <div className="text-sm">{t.dueDate.toLocaleDateString()}</div>

              {t.description !== "" && (
                <Disclosure as="div" defaultOpen={false}>
                  <DisclosureButton>
                    <span className="text-sm flex flex-row gap-1 p-1 rounded-lg dark:hover:bg-white/10 dark:active:bg-white/15 hover:bg-black/10 active:bg-black/15 cursor-pointer px-1">
                      Description
                      <div>
                        <svg
                          className="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <g fill="none">
                            <path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                            <path
                              fill="currentColor"
                              d="M18 3a3 3 0 0 1 2.995 2.824L21 6v12a3 3 0 0 1-2.824 2.995L18 21H6a3 3 0 0 1-2.995-2.824L3 18V6a3 3 0 0 1 2.824-2.995L6 3zm0 2H6a1 1 0 0 0-.993.883L5 6v12a1 1 0 0 0 .883.993L6 19h12a1 1 0 0 0 .993-.883L19 18V6a1 1 0 0 0-.883-.993zm-8.121 5.293L12 12.414l2.121-2.121a1 1 0 0 1 1.415 1.414l-2.829 2.829a1 1 0 0 1-1.414 0l-2.829-2.829a1 1 0 1 1 1.415-1.414"
                            />
                          </g>
                        </svg>
                      </div>
                    </span>
                  </DisclosureButton>
                  <DisclosurePanel>
                    <div className="text-sm p-1 font-bold">{t.description}</div>
                  </DisclosurePanel>
                </Disclosure>
              )}
            </div>
          ))}
      </div>
    </motion.div>
  );
}
