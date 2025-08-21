import { isExists } from "date-fns";
import { useState } from "react";
export default function ListItem({ task, setTasks, taskList }) {
  const [tempTitle, setTempTitle] = useState(task.title);
  const [tempDate, setTempDate] = useState(task.date);
  function handleEditing(taskId) {
    setTasks(
      taskList.map((task) =>
        task.id === taskId
          ? { ...task, title: tempTitle, date: tempDate, isEditing: false }
          : task
      ) /* tasklar içerisinde arama yapılıyor, eğer task bizim istediğimiz task ise, verilerini bizim istediğimiz şekilde yapıp kaydediyor, değilse zaten hiç ellemiyor, olduğu gibi kalıyor */
    );
  }
  function cancelEditing(taskId) {
    const originalTask = taskList.find((t) => t.id === taskId);
    if (originalTask !== undefined) {
      taskList.filter((task) => task.id != taskId);
      setTasks(
        taskList.map((task) => (task.id === taskId ? originalTask : task))
      );
    } else {
      setTasks(taskList.filter((task) => task.id !== taskId));
    }
    setTasks(
      taskList.map((task) => (task.id === taskId ? originalTask : task))
    ); /* eğer task id bizim editlediğimiz görevin id'si ise o eski durumuna dönüyor, eğer değilse zaten diğerleri olduğu gibi kalıyor */
  }
  return task.isEditing ? (
    <div className="p-2 m-1 bg-white/30 rounded-md shadow z-50">
      <div className="flex flex-col gap-2">
        <input
          className="border-1 border-white/40 bg-white/20 rounded-md p-1"
          placeholder="Title of the task"
          type="text"
          name="title"
          value={tempTitle}
          id="titleInput"
          onChange={(e) => setTempTitle(e.target.value)}
        />
        <input
          className="border-1 border-white/40 bg-white/20 rounded-md p-1"
          placeholder="Enter the due date"
          type="date"
          name="date"
          min={new Date()}
          value={tempDate}
          id="dateInput"
          onChange={(e) => setTempDate(e.target.value)}
        />
        <div className="flex flex-row gap-3">
          <button
            className="bg-white/20 rounded-md hover:bg-white/30 text-white p-1 w-fit px-3"
            type="button"
            id="editButton"
            onClick={() => handleEditing(task.id)}
          >
            Save
          </button>
          <button
            className="bg-white/20 rounded-md hover:bg-white/30 text-white p-1 w-fit px-3"
            type="button"
            id="editButton"
            onClick={() => cancelEditing(task.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div> /* editlenebilir durumdaki itemler için */
  ) : (
    <div className="relative p-2 m-1 bg-white/30 rounded-md shadow cursor-grab z-50">
      <svg
        width="27.5px"
        height="27.5px"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        color="#000000"
        className="absolute right-2 hover:bg-white/40 p-1 transition-colors rounded"
      >
        <path
          d="M14.3632 5.65156L15.8431 4.17157C16.6242 3.39052 17.8905 3.39052 18.6716 4.17157L20.0858 5.58579C20.8668 6.36683 20.8668 7.63316 20.0858 8.41421L18.6058 9.8942M14.3632 5.65156L4.74749 15.2672C4.41542 15.5993 4.21079 16.0376 4.16947 16.5054L3.92738 19.2459C3.87261 19.8659 4.39148 20.3848 5.0115 20.33L7.75191 20.0879C8.21972 20.0466 8.65806 19.8419 8.99013 19.5099L18.6058 9.8942M14.3632 5.65156L18.6058 9.8942"
          stroke="#fff"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
      <div className="flex flex-col gap-2">
        <span className="text-lg">{task.title}</span>
        <span className="text-xs">{task.date}</span>
      </div>
    </div>
  );
}
