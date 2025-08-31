import {
  endOfWeek,
  isWithinInterval,
  startOfWeek,
  addDays,
  format,
} from "date-fns";
import { useDroppable } from "@dnd-kit/core";
import ListItem from "./ListItem";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function Weekday({ taskList, setTasks }) {
  //haftanın başlangıcının ve bitişinin tarihini buluyoruz
  const [weekStart, setWeekStart] = useState(
    startOfWeek(new Date(), {
      weekStartsOn: 1,
    })
  );
  const [weekEnd, setWeekEnd] = useState(
    endOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const thisWeekTasks = [];
  taskList.forEach((task) => {
    const taskDate = new Date(task.date);
    const withinInterval = isWithinInterval(taskDate, {
      start: weekStart,
      end: weekEnd,
    });
    //thisWeekTasks'a sadece bu hafta içerisinde olan taskları pushluyoruz
    withinInterval ? thisWeekTasks.push(task) : null;
  });
  //haftanın tarihlerini alıyoruz
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  //taskları günlere göre ayırıyoruz
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  //dictionary'de her günü tasklarına göre map edeceğiz
  const tasksByDay = {};
  weekDates.forEach((date) => {
    const dayID = format(date, "yyyy-MM-dd");
    tasksByDay[dayID] = [];
  });
  thisWeekTasks.forEach((task) => {
    const taskDate = format(new Date(task.date), "yyyy-MM-dd");
    if (tasksByDay[taskDate]) {
      tasksByDay[taskDate].push(task);
    }
  });

  //takvimi bi hafta geri alan buton
  function onPrevClick() {
    const prevWeek = addDays(weekStart, -7);
    setWeekStart(prevWeek);
  }
  //takvimi bir hafta ileri alan buton
  function onNextClick() {
    const nextWeek = addDays(weekStart, 7);
    setWeekStart(nextWeek);
  }
  return (
    <div className="flex gap-5 flex-col md:gap-0 w-full text-white">
      <div className="flex gap-1 mx-3 z-10000 justify-between">
        <div className="">
          <button
            onClick={() => onPrevClick()}
            className="p-2 mx-1 my-3 w-fit hover:bg-white/10 rounded cursor-pointer transition"
          >
            {" "}
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
                d="M16 12H8M8 12L11.5 15.5M8 12L11.5 8.5"
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
          </button>
          <button
            onClick={() => onNextClick()}
            className="p-2 my-3 mx-1 w-fit hover:bg-white/10 rounded cursor-pointer transition"
          >
            {" "}
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
                d="M8 12H16M16 12L12.5 8.5M16 12L12.5 15.5"
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
          </button>
        </div>
        {/* burada da hangi ay ve yıl olduğunu yazacak */}
        <div className="text-lg px-5 py-3">
          {format(weekStart, "MMMM yyyy")}
        </div>
      </div>

      <div className="flex lg:flex-row flex-col w-full">
        <AnimatePresence>
          {weekDates.map((date) => {
            const dayNumber = format(date, "d");
            const dayID = format(date, "yyyy-MM-dd");
            const { setNodeRef } = useDroppable({ id: dayID });
            return (
              <motion.div layout className="w-[100%] lg:w-[15%] z-10">
                <div className="h-full" key={dayID} ref={setNodeRef}>
                  <h3 className="text-center py-2 bg-black/50 z-10">{dayID}</h3>
                  <div className="bg-[#191919] border-gray-600/20 border-1 min-h-[100%] z-10">
                    <div className="justify-self-end m-3">{dayNumber}</div>
                    {tasksByDay[dayID].map((task) => (
                      <motion.div
                        className="z-10"
                        layout
                        key={task.id}
                        initial={{ opacity: 0, y: -2 }}
                        animate={{ opacity: 1, y: 2 }}
                        exit={{ opacity: 0, y: 2 }}
                      >
                        <ListItem
                          isWeeklyView={true}
                          key={task.id}
                          task={task}
                          setTasks={setTasks}
                          taskList={taskList}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
