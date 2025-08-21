import { useState } from "react";
import { addDays, format } from "date-fns";
export default function AddNewItem({ taskList, setTasks }) {
  const tomorrow = addDays(new Date(), 1);
  const formattedTomorrow = format(tomorrow, "dd.MM.yyyy");

  function handleClick() {
    const newTask = {
      id: taskList.length + 1,
      title: "",
      status: "todo",
      date: formattedTomorrow,
      isEditing: true,
    };
    setTasks([
      ...taskList,
      newTask,
    ]); /* burada varolan array + yeni itemimiz ile yeni bir array oluşturuyoruz */
  }
  return (
    <button
      onClick={handleClick}
      className="border-1 border-dashed rounded-md justify-self-center w-[97%] p-1 m-1 cursor-pointer"
    >
      <span>Add new item +</span>
    </button>
  );
}
