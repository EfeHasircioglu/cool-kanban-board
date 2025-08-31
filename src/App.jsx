import { useEffect, useState } from "react";
import "./App.css";
import List from "./List";
import WeekdayView from "./WeekdayView";
import { DndContext } from "@dnd-kit/core";
import { AnimatePresence, motion } from "motion/react";
import Archive from "./Archive";
//TODO: bi şey olunca archivedTasks'daki hiçbir şey görünmüyor ama buna neden olan şeyin ne olduğu hakkında hiçbir fikrim yok
//TODO: görevlerin actions menüsünün z-index sıkıntısı var...
// belki haftalık view eklemek güzel fikir olabilir
function App() {
  //haftalık view ile günlük view arasında state geçişi
  const [viewMode, setViewMode] = useState("kanban");
  const today = new Date(); // bugün
  // bildirim ile ilgili şeyler
  const [notification, setNotification] = useState({
    message: "",
    isVisible: false,
  });
  function showNotification() {
    setNotification({ message: "Task moved to archived", isVisible: true });
    setTimeout(() => {
      setNotification({ message: "", isVisible: false });
    }, 5000);
  }
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  //DEBUG İÇİN
  function addTask() {
    const newTask = {
      id: crypto.randomUUID(),
      title: "kedikedikedi bochi",
      status: "todo",
      date: "2024-08-20",
      isEditing: false,
    };
    setTasks([
      ...tasks,
      newTask,
    ]); /* burada varolan array + yeni itemimiz ile yeni bir array oluşturuyoruz */
  }
  /* eski bi task yaratmak için, arşiv özelliğini test etmek için */
  const [isArchivedOpen, setArchivedOpen] = useState(false);
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });
  const archivedTasks = tasks.filter(
    (task) => task.status === "done" && new Date(task.date) < today
  );

  const activeTasks = tasks.filter(
    (task) => !(task.status === "done" && new Date(task.date) < today)
  );
  // dragın bırakma / bırakılma kısmını düzenleyen fonksiyon
  function handleDragEnd(e) {
    const { active, over } = e;
    if (!over) return;
    const taskId = active.id;
    const newStatus = over.id;
    const newDate = over.id;
    if (viewMode === "kanban") {
      setTasks((tasks) =>
        tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      // notification check
      const movedTask = tasks.find((t) => t.id === taskId);
      if (
        movedTask &&
        newStatus === "done" &&
        new Date(movedTask.date) < today
      ) {
        showNotification();
      }
    } else if (viewMode === "week") {
      setTasks((tasks) =>
        tasks.map((t) => (t.id === taskId ? { ...t, date: newDate } : t))
      );
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen w-full bg-[#0a0a0a] relative">
        {/* Cosmic Aurora */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
        radial-gradient(ellipse at 20% 30%, rgba(56, 189, 248, 0.4) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 70%),
        radial-gradient(ellipse at 60% 20%, rgba(236, 72, 153, 0.25) 0%, transparent 50%),
        radial-gradient(ellipse at 40% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 65%)
      `,
          }}
        />
        <div className="relative">
          <div className="absolute flex flex-row gap-3 left-0 top-0 m-3">
            <button
              onClick={() => setViewMode("kanban")}
              className="cursor-pointer transition-colors duration-300 hover:bg-white/10 rounded p-2"
            >
              <svg
                width="24px"
                height="24px"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="#fff"
              >
                <path
                  d="M3 3.6V20.4C3 20.7314 3.26863 21 3.6 21H20.4C20.7314 21 21 20.7314 21 20.4V3.6C21 3.26863 20.7314 3 20.4 3H3.6C3.26863 3 3 3.26863 3 3.6Z"
                  stroke="#fff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M6 6L6 16"
                  stroke="#fff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M10 6V9"
                  stroke="#fff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M14 6V13"
                  stroke="#fff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M18 6V11"
                  stroke="#fff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </button>
            <button
              onClick={() => setViewMode("week")}
              className="cursor-pointer transition-colors duration-300 hover:bg-white/10 rounded p-2"
            >
              <svg
                width="24px"
                height="24px"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="#fff"
              >
                <path
                  d="M9 3H3.6C3.26863 3 3 3.26863 3 3.6V20.4C3 20.7314 3.26863 21 3.6 21H9M9 3V21M9 3H15M9 21H15M15 3H20.4C20.7314 3 21 3.26863 21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H15M15 3V21"
                  stroke="#fff"
                  strokeWidth="1.5"
                ></path>
              </svg>
            </button>
          </div>
          <div
            onClick={(e) => setArchivedOpen((prev) => !prev)}
            className="absolute right-0 top-0 m-3 p-2 cursor-pointer hover:bg-white/10 transition-colors duration-300 rounded z-100"
          >
            <svg
              width="24px"
              height="24px"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="#fff"
            >
              <path
                d="M7 6L17 6"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M7 9L17 9"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M9 17H15"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M3 12H2.6C2.26863 12 2 12.2686 2 12.6V21.4C2 21.7314 2.26863 22 2.6 22H21.4C21.7314 22 22 21.7314 22 21.4V12.6C22 12.2686 21.7314 12 21.4 12H21M3 12V2.6C3 2.26863 3.26863 2 3.6 2H20.4C20.7314 2 21 2.26863 21 2.6V12M3 12H21"
                stroke="#fff"
                strokeWidth="1.5"
              ></path>
            </svg>
          </div>
          <div className="relative">
            <AnimatePresence>
              {isArchivedOpen && <Archive tasks={archivedTasks} />}
            </AnimatePresence>
          </div>
        </div>
        <AnimatePresence>
          {viewMode === "kanban" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <div className="p-10 py-20 z-100 md:grid md:grid-cols-3 md:grid-rows-1 text-white md:w-[95%] md:mx-auto">
                <List
                  bgColor="green"
                  header="To-do"
                  status="todo"
                  addSection
                  taskList={activeTasks}
                  setTasks={setTasks}
                ></List>
                <List
                  bgColor="blue"
                  header="In progress"
                  status="inProgress"
                  taskList={activeTasks}
                  setTasks={setTasks}
                ></List>
                <List
                  bgColor="red"
                  header="Done"
                  status="done"
                  taskList={activeTasks}
                  setTasks={setTasks}
                ></List>
                <button
                  onClick={() => addTask()}
                  className="z-100 cursor-pointer p-1 rounded bg-black active:bg-gray-900"
                >
                  Create Task
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="pt-20 z-0">
              <WeekdayView
                setTasks={setTasks}
                taskList={activeTasks}
              ></WeekdayView>
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {notification.isVisible && (
            <motion.div
              key="notification"
              className=" m-5 absolute bottom-0 left-1/2 -translate-x-1/2 z-10000"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 2 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <div className="p-1 rounded w-fit text-white bg-black text-xl">
                {notification.message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DndContext>
  );
}

export default App;
