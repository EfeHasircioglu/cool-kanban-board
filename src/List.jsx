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
      className={`m-4 h-auto rounded-md group shadow-2xl shadow-black ${bgColors[bgColor]}`}
    >
      <div className="flex flex-col">
        <div className="px-4 py-2">{header}</div>
        {taskList
          .filter((task) => task.status === status)
          .map((task) => (
            <ListItem
              key={task.id}
              task={task}
              setTasks={setTasks}
              taskList={taskList}
            />
          ))}
        {addSection && (
          <div
            className={`${
              taskList.length === 0
                ? "block self-center"
                : "opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50"
            }`}
          >
            <AddNewItem taskList={taskList} setTasks={setTasks} />
          </div>
        )}
      </div>
    </div>
  );
}
