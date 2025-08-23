import { addDays, format } from "date-fns";
export default function AddNewItem({ taskList, setTasks }) {
  const tomorrow = addDays(new Date(), 1);
  const formattedTomorrow = format(tomorrow, "dd.MM.yyyy");

  function handleClick() {
    const newTask = {
      id: taskList.length + 1,
      title: "",
      status: "todo",
      date: tomorrow,
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
      className="z-50 cursor-pointer hover:bg-white/20 p-0.5 rounded justify-self-center"
    >
      <span>
        <svg
          width="21px"
          height="21px"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="#fff"
          className="h-full w-full mx-auto"
        >
          <path
            d="M8 12H12M16 12H12M12 12V8M12 12V16"
            stroke="#fff"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="#fff"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </span>
    </button>
  );
}
