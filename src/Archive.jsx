import { AnimatePresence, motion } from "motion/react";
export default function Archive({ tasks }) {
  return (
    <motion.div
      className="z-1000"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div className="bg-black/80 backdrop-blur-md shadow-lg z-1000 h-auto max-h-[80vh] overflow-auto w-[50vw] absolute right-3 top-16 rounded">
        <div className="z-10000 text-white text-lg p-5">
          <div className="text-white py-3 px-2 text-2xl">Past Tasks</div>
          {tasks.length === 0 ? (
            <div className="px-2">No past tasks</div>
          ) : (
            tasks.map((task) => (
              <div className="p-2 hover:bg-white/10 border-1 flex flex-col gap-2 my-3 rounded border-white/30">
                <div className="text-xl" key={task.id}>
                  {task.title}
                </div>
                <div className="text-base">{task.date}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
