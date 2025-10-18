import { motion } from "motion/react";
import { db } from "./taskDb";
import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";
import type { Task } from "./taskDb";
import WeeklyViewTask from "./WeeklyViewTask";
export default function WeeklyView() {
  const rawTasks = useLiveQuery(() => db.tasks.toArray()) || [];
  const tasks: Task[] = useMemo(() => rawTasks, [rawTasks]);
  /* calculating the first day of the week */
  const weekDates = useMemo(() => {
    const date = new Date(); /* bugünün tam tarihi */
    const today: number = date.getDay(); /* bugünün günü */
    const diff = today === 0 ? 6 : today - 1; /* pazartesi için ayarlama */
    let monday = new Date(date);
    monday.setDate(date.getDate() - diff);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + i);
      dates.push(currentDate.toLocaleDateString());
    }
    return dates;
  }, []);

  const [
    weekMonDate,
    weekTueDate,
    weekWedDate,
    weekThrsDate,
    weekFriDate,
    weekSatDate,
    weekSunDate,
  ] = weekDates;

  function weekForward() {}
  function weekBackward() {}
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mt-6"
    >
      <div className="ml-5 flex flex-row gap-1">
        <button
          title="Next Week"
          onClick={() => weekBackward()}
          className="bg-[#fff1e6]/75 h-auto p-1.5 rounded-lg font-header font-semibold cursor-pointer hover:bg-[#fff1e6]/65 active:bg-[#fff1e6]/50"
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g fill="none" fillRule="evenodd">
              <path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
              <path
                fill="currentColor"
                d="M10 6.414L4.413 12L10 17.586V15c0-.545.455-1 1-1h9v-4h-9a1 1 0 0 1-1-1zm-.902-1.926C10.168 3.417 12 4.175 12 5.69V8h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-8v2.31c0 1.515-1.831 2.273-2.902 1.202l-6.453-6.451a1.5 1.5 0 0 1 0-2.122z"
              />
            </g>
          </svg>
        </button>
        <button
          title="Next Week"
          onClick={() => weekForward()}
          className="bg-[#fff1e6]/75 h-auto p-1.5 rounded-lg font-header font-semibold cursor-pointer hover:bg-[#fff1e6]/65 active:bg-[#fff1e6]/50"
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g fill="none" fillRule="evenodd">
              <path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
              <path
                fill="currentColor"
                d="M14 17.586L19.587 12L14 6.414V9c0 .545-.455 1-1 1H4v4h9a1 1 0 0 1 1 1zm.902 1.926C13.831 20.583 12 19.825 12 18.31V16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h8V5.69c0-1.515 1.831-2.273 2.902-1.202l6.453 6.451a1.5 1.5 0 0 1 0 2.121z"
              />
            </g>
          </svg>
        </button>
      </div>
      <div className="lg:grid lg:grid-cols-7 mt-2 m-5 lg:gap-2 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg font-header font-semibold">
            {weekMonDate}
          </div>
          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg text-sm">
            Mon
          </div>
          <div className="flex flex-col gap-2">
            {tasks
              .filter(
                (t: Task) =>
                  t.dueDate.toLocaleDateString().split("T")[0] === weekMonDate
              )
              .map((task: Task) => (
                <WeeklyViewTask key={task._id} task={task} />
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg font-header font-semibold">
            {weekTueDate}
          </div>

          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg text-sm">
            Tue
          </div>
          <div className="flex flex-row gap-2">
            {tasks
              .filter(
                (t: Task) =>
                  t.dueDate.toLocaleDateString().split("T")[0] === weekTueDate
              )
              .map((task: Task) => (
                <WeeklyViewTask key={task._id} task={task} />
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg font-header font-semibold">
            {weekWedDate}
          </div>

          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg text-sm">
            Wed
          </div>
          <div className="flex flex-row gap-2">
            {tasks
              .filter(
                (t: Task) =>
                  t.dueDate.toLocaleDateString().split("T")[0] === weekWedDate
              )
              .map((task: Task) => (
                <WeeklyViewTask key={task._id} task={task} />
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg font-header font-semibold">
            {weekThrsDate}
          </div>

          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg text-sm">
            Thrs
          </div>
          <div className="flex flex-row gap-2">
            {tasks
              .filter(
                (t: Task) =>
                  t.dueDate.toLocaleDateString().split("T")[0] === weekThrsDate
              )
              .map((task: Task) => (
                <WeeklyViewTask key={task._id} task={task} />
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg font-header font-semibold">
            {weekFriDate}
          </div>

          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg text-sm">
            Fri
          </div>
          <div className="flex flex-row gap-2">
            {tasks
              .filter(
                (t: Task) =>
                  t.dueDate.toLocaleDateString().split("T")[0] === weekFriDate
              )
              .map((task: Task) => (
                <WeeklyViewTask key={task._id} task={task} />
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg font-header font-semibold">
            {weekSatDate}
          </div>

          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg text-sm">
            Sat
          </div>
          <div className="flex flex-col gap-2">
            {tasks
              .filter(
                (t: Task) =>
                  t.dueDate.toLocaleDateString().split("T")[0] === weekSatDate
              )
              .map((task: Task) => (
                <WeeklyViewTask key={task._id} task={task} />
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg font-header font-semibold">
            {weekSunDate}
          </div>
          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg text-sm">
            Sun
          </div>
          <div className="flex flex-row gap-2">
            {tasks
              .filter(
                (t: Task) =>
                  t.dueDate.toLocaleDateString().split("T")[0] === weekSunDate
              )
              .map((task: Task) => (
                <WeeklyViewTask key={task._id} task={task} />
              ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
