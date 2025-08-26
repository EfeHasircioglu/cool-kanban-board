import { useEffect, useState } from "react";
import "./App.css";
import List from "./List";
import { DndContext } from "@dnd-kit/core";
import { AnimatePresence, motion } from "motion/react";
import Archive from "./Archive";
//TODO: bi şey olunca archivedTasks'daki hiçbir şey görünmüyor ama buna neden olan şeyin ne olduğu hakkında hiçbir fikrim yok
//TODO: görevlerin actions menüsünün z-index sıkıntısı var...
function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  /* eski bi task yaratmak için, arşiv özelliğini test etmek için */
  const [isArchivedOpen, setArchivedOpen] = useState(false);
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });
  const today = new Date();

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

    setTasks((tasks) =>
      tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
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
          <div
            onClick={(e) => setArchivedOpen((prev) => !prev)}
            className="absolute right-0 top-0 m-3 p-2 cursor-pointer hover:bg-white/30 transition-colors duration-300 rounded z-100"
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
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M7 9L17 9"
                stroke="#fff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M9 17H15"
                stroke="#fff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M3 12H2.6C2.26863 12 2 12.2686 2 12.6V21.4C2 21.7314 2.26863 22 2.6 22H21.4C21.7314 22 22 21.7314 22 21.4V12.6C22 12.2686 21.7314 12 21.4 12H21M3 12V2.6C3 2.26863 3.26863 2 3.6 2H20.4C20.7314 2 21 2.26863 21 2.6V12M3 12H21"
                stroke="#fff"
                stroke-width="1.5"
              ></path>
            </svg>
          </div>
          <div className="relative">
            <AnimatePresence>
              {isArchivedOpen && <Archive tasks={archivedTasks} />}
            </AnimatePresence>
          </div>
        </div>
        <div className="p-20 z-100 md:grid md:grid-cols-3 md:grid-rows-1 text-white md:w-[90%] md:mx-auto">
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
            onClick={() => addOldTask()}
            className="z-100000 cursor-alias"
          >
            add old task:debug
          </button>
        </div>
      </div>
    </DndContext>
  );
}

export default App;
