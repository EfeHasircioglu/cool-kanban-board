import { div } from "motion/react-client";
import ListItem from "./ListItem";

export default function Weekday({ taskList, setTasks }) {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  function getTasksByDay(tasks) {
    const tasksByDay = {};
    daysOfWeek.forEach((day) => (tasksByDay[day] = []));

    tasks.forEach((task) => {
      const taskDate = new Date(task.date);
      const dayIndex = taskDate.getDay();
      const dayName = daysOfWeek[dayIndex === 0 ? 6 : dayIndex - 1];
      tasksByDay[dayName].push(task);
    });

    return tasksByDay;
  }
  const tasksByDay = getTasksByDay(taskList);

  return (
    <div className="z-100 flex flex-col gap-5 md:flex-row md:gap-3  text-white">
      {daysOfWeek.map((day) => (
        <div key={day}>
          {" "}
          <h3>{day}</h3>
          {tasksByDay[day].map((task) => (
            <ListItem
              key={task.id}
              task={task}
              setTasks={setTasks}
              taskList={taskList}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
