import { title } from "motion/react-client";
import { useState } from "react";
import "./App.css";
import List from "./List";
/* yapılacaklar: drag & drop özelliği, genel olarak tarihle ilgili olan şeylerin düzeltilmesi, edit butonuna basınca gelen edit/delete dropdownunun z index sorununun düzeltilmesi, editi cancelleyinceki gibi bazı animasyonların düzeltilmesi ve daha smooth hale getirilmesi.  */
function App() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Task 1",
      status: "todo",
      date: "21.08.2025",
      isEditing: false,
    },
    {
      id: 2,
      title: "Task 2",
      status: "inProgress",
      date: "21.08.2025",
      isEditing: false,
    },
    {
      id: 3,
      title: "Task 3",
      status: "done",
      date: "21.08.2025",
      isEditing: false,
    },
  ]);

  return (
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
      <div className=" p-20 md:grid md:grid-cols-3 md:grid-rows-1 text-white md:w-[90%] md:mx-auto">
        <List
          bgColor="green"
          header="To-do"
          status="todo"
          addSection
          taskList={tasks}
          setTasks={setTasks}
        ></List>
        <List
          bgColor="blue"
          header="In progress"
          status="inProgress"
          taskList={tasks}
          setTasks={setTasks}
        ></List>
        <List
          bgColor="red"
          header="Done"
          status="done"
          taskList={tasks}
          setTasks={setTasks}
        ></List>
      </div>
    </div>
  );
}

export default App;
