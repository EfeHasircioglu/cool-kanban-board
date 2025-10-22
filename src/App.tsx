/* bu uygulamada main butonlar, componentler falan olacak */
import { Route, Switch, useLocation } from "wouter";
import toast, { Toaster } from "react-hot-toast";
import { useMemo } from "react";
import Kanban from "./Kanban";
import WeeklyView from "./WeeklyView";
import { forwardRef, useEffect, useState, useRef } from "react";
import { useTasks } from "./store";
import type { Task } from "./taskDb";
import KanbanTask from "./KanbanTask";
import { AnimatePresence, motion } from "motion/react";
import DatePicker from "react-datepicker";
import PastTasks from "./PastTasks";
import { db } from "./taskDb";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.min.css";
import EditMenu from "./EditMenu";
import {
  DndContext,
  DragOverlay,
  useSensor,
  TouchSensor,
  useSensors,
  MouseSensor,
} from "@dnd-kit/core";
import { useLiveQuery } from "dexie-react-hooks";
import { div } from "motion/react-client";
//TODO: maybe a toast when a task qualifies for being a past task
function App() {
  /* bazı küçük şeyler için state'ler */
  const [location, setLocation] = useLocation();
  const [isAddOpen, setIsAddOpen] = useState<Boolean>(false);
  const [taskNameValue, setTaskNameValue] = useState<string>("");
  const [taskDescValue, setTaskDescValue] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");
  const [droppedTask, setDroppedTask] = useState<Task>();
  /* sidebarın açıklık-kapanıklığı için bir state */
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  /* tasks içerisinden seçim yapabilmemiz için */
  const rawTasks = useLiveQuery(() => db.tasks.toArray()) || [];
  const tasks: Task[] = useMemo(() => rawTasks, [rawTasks]);
  /* date inputu butonu için */
  type dateInputProps = {
    className?: string;
    value?: string;
    onClick?: () => void;
  };
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const CustomDateInput = forwardRef<HTMLButtonElement, dateInputProps>(
    ({ onClick }, ref) => (
      <button
        onClick={onClick}
        ref={ref}
        className="bg-white/20 hover:bg-white/10 dark:bg-black/30 dark:hover:bg-black/20 dark:text-white p-1 rounded-lg cursor-pointer"
        title="Set Date"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7"
          viewBox="0 0 24 24"
        >
          <g fill="none">
            <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
            <path
              fill="currentColor"
              d="M17 12a5 5 0 1 1 0 10a5 5 0 0 1 0-10m-1-9a1 1 0 0 1 1 1v1h2a2 2 0 0 1 2 2v3h-2V7H5v12h5v2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2V4a1 1 0 0 1 2 0v1h6V4a1 1 0 0 1 1-1m1 11a3 3 0 1 0 0 6a3 3 0 0 0 0-6m0 .5a1 1 0 0 1 1 1v.5a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1v-1.5a1 1 0 0 1 1-1M8.5 14a1 1 0 0 1 .117 1.993L8.5 16H8a1 1 0 0 1-.117-1.993L8 14zm2.5-4a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2z"
            ></path>
          </g>
        </svg>
      </button>
    )
  );

  /* eğer bir task done olursa ve zamanı geçmişse bi toast çıksın */
  const filtered = useMemo(
    () => tasks.filter((t) => new Date(t.dueDate) > new Date()),
    []
  );

  const prevLength = useRef(filtered.length);
  useEffect(() => {
    if (filtered.length > prevLength.current) {
      toast("Task completed!", {
        icon: "✔️",
      });
    }
    prevLength.current = filtered.length;
  }, [filtered.length]);
  const {
    syncing,
    addTask,
    error,
    clearError,
    tempTitle,
    tempDesc,
    tempDate,
    updateTask,
    editingTask,
    isEditOpen,
  }: any = useTasks();

  function goToKanban() {
    setLocation("/kanban");
  }
  function goToWeekly() {
    setLocation("/weekly");
  }
  function goToPastTasks() {
    setLocation("/past-tasks");
  }
  /* eğer add modal kapanırsa veya yeni bir task eklenirse içindekiler temizlensin */
  useEffect(() => {
    setTaskNameValue("");
    setTaskDescValue("");
    setTitleError("");
    setSelectedDate(new Date()); // bugün
  }, [isAddOpen]);
  /* to-do durumunda olacak, kullanıcının girdiği verilere sahip yeni bir task oluşturan fonksiyon  */
  function addNewTask() {
    const newTask: Task = {
      _id: crypto.randomUUID(),
      title: taskNameValue.trim(),
      description: taskDescValue.trim(),
      dueDate: selectedDate || new Date(),
      state: "todo",
    };
    addTask(newTask);
    setIsAddOpen(false);
  }
  /* dokumna arayüzü içeren cihazlarda drag & drop çalışması için */
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  function handleDragStart(event: any) {
    const droppedTaskId: string = event.active.id.split("/")[0];
    setDroppedTask(tasks?.find((t) => t._id === droppedTaskId));
  }
  /* drag&drop fonksiyonunda drag bitişinde kanban tasklarının statuslarını değiştiriyoruz */
  function handleDragEnd(event: any) {
    if (event.over) {
      if (!droppedTask) return;

      switch (event.over.id) {
        case "droppable-todo":
          const updatedTaskTodo: Task = {
            _id: droppedTask._id,
            title: droppedTask.title,
            description: droppedTask.description,
            dueDate: droppedTask.dueDate,
            state: "todo",
          };
          updateTask(updatedTaskTodo, droppedTask);
          setDroppedTask(undefined);
          break;
        case "droppable-inprogress":
          const updatedTaskInprogress: Task = {
            _id: droppedTask._id,
            title: droppedTask.title,
            description: droppedTask.description,
            dueDate: droppedTask.dueDate,
            state: "inProgress",
          };
          updateTask(updatedTaskInprogress, droppedTask);
          setDroppedTask(undefined);

          break;
        case "droppable-done":
          const updatedTaskDone: Task = {
            _id: droppedTask._id,
            title: droppedTask.title,
            description: droppedTask.description,
            dueDate: droppedTask.dueDate,
            state: "done",
          };
          updateTask(updatedTaskDone, droppedTask);
          setDroppedTask(undefined);

          break;
        default:
      }
    }
  }
  /* edit fonksiyonu da burada, bu tarz fonksiyonlar toplu yerde olsun diye */
  function editTask() {
    const updatedTask: Task = {
      _id: editingTask._id,
      title: tempTitle || editingTask.title,
      description: tempDesc || editingTask.desc,
      dueDate: new Date(tempDate) || new Date(editingTask.dueDate),
      state: editingTask.state,
    };
    updateTask(updatedTask, editingTask);
  }
  /* uygulama ilk açıldığında, direk kanban'a yönlendiriyor */
  useEffect(() => {
    if (location === "/") {
      setLocation("/kanban");
    }
  });
  /* edit menüsü açıldığı zaman obdy overflow hidden olur, kapandığı zaman tersi */
  useEffect(() => {
    if (isEditOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "initial";
    }
  }, [isEditOpen]);
  return (
    <div className="select-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="fixed top-0 left-0 h-screen w-screen max-h-none -z-1 transition-all duration-500 dark:hue-rotate-180"
        id="visual"
        viewBox="0 0 900 900"
        width="900"
        height="900"
        version="1.1"
      >
        <defs>
          <filter id="blur1" x="-10%" y="-10%" width="120%" height="120%">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="189"
              result="effect1_foregroundBlur"
            />
          </filter>
        </defs>
        <rect width="900" height="900" fill="#F7770F" />
        <g filter="url(#blur1)">
          <circle cx="513" cy="86" fill="#6600FF" r="420" />
          <circle cx="759" cy="110" fill="#F7770F" r="420" />
          <circle cx="1" cy="66" fill="#6600FF" r="420" />
          <circle cx="704" cy="882" fill="#6600FF" r="420" />
          <circle cx="69" cy="352" fill="#F7770F" r="420" />
          <circle cx="344" cy="825" fill="#6600FF" r="420" />
        </g>
      </svg>
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between">
          <div className="w-fit">
            <button
              title="Menu"
              className="hover:bg-white/90 bg-white dark:bg-black dark:hover:bg-black/90 p-1 m-2 rounded-lg cursor-pointer"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 dark:text-white/80"
                viewBox="0 0 24 24"
              >
                <g fill="none">
                  <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                  <path
                    fill="currentColor"
                    d="M20 18a1 1 0 0 1 .117 1.993L20 20H4a1 1 0 0 1-.117-1.993L4 18zm0-7a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2zm0-7a1 1 0 1 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                </g>
              </svg>
            </button>
            {/* //TODO: slide-in, slide-out animasyonu yapılacak  */}
            {isSidebarOpen && (
              <div className="absolute shadow-2xl left-0 top-0 h-screen w-screen sm:w-fit bg-white/50 dark:bg-black/50 backdrop-blur-2xl rounded-r-lg z-1000">
                <div className="mx-2 flex flex-col">
                  <button
                    title="Go Back"
                    onClick={() => setIsSidebarOpen((prev) => !prev)}
                    className="bg-white/20 w-min dark:bg-black/40 ${
                    } hover:bg-white/10  dark:hover:bg-black/50 p-1 m-2 rounded-lg cursor-pointer"
                  >
                    <div className="flex flex-row p-1 items-center gap-2 ">
                      <svg
                        className="h-7 dark:text-white/80"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g fill="none" fill-rule="evenodd">
                          <path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                          <path
                            fill="currentColor"
                            d="M9.098 4.488C10.168 3.417 12 4.175 12 5.69V8h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-8v2.31c0 1.515-1.831 2.273-2.902 1.202l-6.453-6.451a1.5 1.5 0 0 1 0-2.122z"
                          />
                        </g>
                      </svg>
                    </div>
                  </button>
                  <button
                    title="Kanban View"
                    onClick={() => goToKanban()}
                    className={`bg-white/20 dark:bg-black/40 ${
                      location === "/kanban"
                        ? "border-white/50 dark:border-black/50 border-1"
                        : ""
                    } hover:bg-white/10  dark:hover:bg-black/50 p-1 m-2 rounded-lg cursor-pointer`}
                  >
                    <div className="flex flex-row p-1 items-center gap-2 ">
                      <svg
                        className="h-7 dark:text-white/80"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g fill="none" fill-rule="evenodd">
                          <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                          <path
                            fill="currentColor"
                            d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2H5v14h14zm-9 1a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 10 17H7.5A1.5 1.5 0 0 1 6 15.5v-8A1.5 1.5 0 0 1 7.5 6zm-.5 2H8v7h1.5zm7-2a1.5 1.5 0 0 1 1.493 1.356L18 7.5v3a1.5 1.5 0 0 1-1.356 1.493L16.5 12H14a1.5 1.5 0 0 1-1.493-1.356L12.5 10.5v-3a1.5 1.5 0 0 1 1.356-1.493L14 6zM16 8h-1.5v2H16z"
                          />
                        </g>
                      </svg>
                      <div className=" dark:text-white/80 flex h-full">
                        Kanban View
                      </div>
                    </div>
                  </button>
                  <button
                    title="Weekly View"
                    onClick={() => goToWeekly()}
                    className={`bg-white/20 dark:bg-black/40 ${
                      location === "/weekly"
                        ? "border-white/50 dark:border-black/50 border-1"
                        : ""
                    } hover:bg-white/10  dark:hover:bg-black/50 p-1 m-2 rounded-lg cursor-pointer`}
                  >
                    <div className="flex flex-row p-1 items-center gap-2">
                      <svg
                        className=" h-7 dark:text-white/80"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g fill="none">
                          <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                          <path
                            fill="currentColor"
                            d="M19 3a2 2 0 0 1 1.995 1.85L21 5v14a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19V5a2 2 0 0 1 1.85-1.995L5 3zm0 2H5v14h14zM8 7a1 1 0 0 1 .993.883L9 8v8a1 1 0 0 1-1.993.117L7 16V8a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1m4 0a1 1 0 0 1 .993.883L17 8v8a1 1 0 0 1-1.993.117L15 16V8a1 1 0 0 1 1-1"
                          />
                        </g>
                      </svg>
                      <div className=" dark:text-white/80 flex h-full">
                        Weekly View
                      </div>
                    </div>
                  </button>
                  {/* TODO: tasks view'de tasklar normal todo list gibi görüntülenecek ve taskları belirli şeylere göre filtreleme opsiyonu falan olacak, buray abaştan bir todo list yapacağız ama edit ve delete'yi çalabiliriz diğer yerlerden tabi  */}
                  <button
                    title="Tasks View"
                    onClick={() => console.log()}
                    className={`bg-white/20 dark:bg-black/40 ${
                      location === "/"
                        ? "border-white/50 dark:border-black/50 border-1"
                        : ""
                    } hover:bg-white/10  dark:hover:bg-black/50 p-1 m-2 rounded-lg cursor-pointer`}
                  >
                    <div className="flex flex-row p-1 items-center gap-2 ">
                      <svg
                        className="h-7 dark:text-white/80"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g fill="none" fill-rule="evenodd">
                          <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                          <path
                            fill="currentColor"
                            d="M15 2a2 2 0 0 1 1.732 1H18a2 2 0 0 1 2 2v12a5 5 0 0 1-5 5H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1.268A2 2 0 0 1 9 2zM7 5H6v15h9a3 3 0 0 0 3-3V5h-1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2m9.238 4.379a1 1 0 0 1 0 1.414l-4.95 4.95a1 1 0 0 1-1.414 0l-2.12-2.122a1 1 0 0 1 1.413-1.414l1.415 1.414l4.242-4.242a1 1 0 0 1 1.414 0M15 4H9v1h6z"
                          />
                        </g>
                      </svg>
                      <div className=" dark:text-white/80 flex h-full">
                        Tasks View
                      </div>
                    </div>
                  </button>
                  <button
                    title="Pomodoro Timer"
                    onClick={() => console.log()}
                    className={`bg-white/20 dark:bg-black/40 ${
                      location === "/"
                        ? "border-white/50 dark:border-black/50 border-1"
                        : ""
                    } hover:bg-white/10  dark:hover:bg-black/50 p-1 m-2 rounded-lg cursor-pointer`}
                  >
                    <div className="flex flex-row p-1 items-center gap-2 ">
                      <svg
                        className="h-7 dark:text-white/80"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="m20.145 8.27l1.563-1.563l-1.414-1.414L18.586 7c-1.05-.63-2.274-1-3.586-1c-3.859 0-7 3.14-7 7s3.141 7 7 7s7-3.14 7-7a6.97 6.97 0 0 0-1.855-4.73M15 18c-2.757 0-5-2.243-5-5s2.243-5 5-5s5 2.243 5 5s-2.243 5-5 5"
                        />
                        <path
                          fill="currentColor"
                          d="M14 10h2v4h-2zm-1-7h4v2h-4zM3 8h4v2H3zm0 8h4v2H3zm-1-4h3.99v2H2z"
                        />
                      </svg>
                      <div className=" dark:text-white/80 flex h-full">
                        Pomodoro Timer
                      </div>
                    </div>
                  </button>
                  <button
                    title="Past Tasks"
                    onClick={() => goToPastTasks()}
                    className={`bg-white/20 dark:bg-black/40 ${
                      location === "/past-tasks"
                        ? "border-white/50 dark:border-black/50 border-1"
                        : ""
                    } hover:bg-white/10  dark:hover:bg-black/50 p-1 m-2 rounded-lg cursor-pointer`}
                  >
                    <div className="flex flex-row p-1 items-center gap-2">
                      <svg
                        className="h-7 dark:text-white/80"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g fill="none" fill-rule="evenodd">
                          <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                          <path
                            fill="currentColor"
                            d="M10.975 3.002a1 1 0 0 1-.754 1.196a8 8 0 0 0-.583.156a1 1 0 0 1-.59-1.911q.36-.112.73-.195a1 1 0 0 1 1.197.754m2.05 0a1 1 0 0 1 1.196-.754c4.454 1.01 7.78 4.992 7.78 9.752c0 5.523-4.478 10-10 10c-4.761 0-8.743-3.325-9.753-7.779a1 1 0 0 1 1.95-.442a8 8 0 1 0 9.58-9.58a1 1 0 0 1-.753-1.197M6.614 4.72a1 1 0 0 1-.053 1.414q-.222.205-.427.426A1 1 0 0 1 4.668 5.2q.255-.276.532-.533a1 1 0 0 1 1.414.053M12 6a1 1 0 0 1 1 1v4.586l2.707 2.707a1 1 0 0 1-1.414 1.414l-3-3A1 1 0 0 1 11 12V7a1 1 0 0 1 1-1M3.693 8.388a1 1 0 0 1 .661 1.25a8 8 0 0 0-.156.583a1 1 0 0 1-1.95-.442q.084-.37.195-.73a1 1 0 0 1 1.25-.661"
                          />
                        </g>
                      </svg>
                      <div className=" dark:text-white/80 flex h-full">
                        Past Tasks
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
            {/*   */}
            {syncing && (
              <button
                title="Saving changes to the offline database"
                className={`bg-black/20 hover:bg-black/10 p-1 my-2 ml-2 rounded-lg cursor-pointer `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className=" h-7"
                  viewBox="0 0 24 24"
                >
                  <g fill="#fff">
                    <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                    <path
                      fill="#fff"
                      d="M20 9a1 1 0 0 1 1 1v1a8 8 0 0 1-8 8H9.414l.793.793a1 1 0 0 1-1.414 1.414l-2.496-2.496a1 1 0 0 1-.287-.567L6 17.991a1 1 0 0 1 .237-.638l.056-.06l2.5-2.5a1 1 0 0 1 1.414 1.414L9.414 17H13a6 6 0 0 0 6-6v-1a1 1 0 0 1 1-1m-4.793-6.207l2.5 2.5a1 1 0 0 1 0 1.414l-2.5 2.5a1 1 0 1 1-1.414-1.414L14.586 7H11a6 6 0 0 0-6 6v1a1 1 0 1 1-2 0v-1a8 8 0 0 1 8-8h3.586l-.793-.793a1 1 0 0 1 1.414-1.414"
                    />
                  </g>
                </svg>
              </button>
            )}
          </div>
          <div className="m-2 flex flex-row gap-2">
            <AnimatePresence>
              {isAddOpen && (
                <motion.div
                  initial={{ y: -100 }}
                  animate={{ y: 0 }}
                  exit={{ y: -100 }}
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 36,
                    mass: 1,
                    duration: 0.2,
                  }}
                >
                  <div className="flex md:flex-row flex-col gap-2">
                    <div className="flex flex-col gap-2">
                      <input
                        onChange={(e) => setTaskNameValue(e.target.value)}
                        value={taskNameValue}
                        name="task-name-cool-kanban"
                        type="text"
                        placeholder="Task Name"
                        className={`rounded-lg p-1 max-h-[36px] bg-white/20 dark:bg-black/30 dark:hover:bg-black/10 dark:text-white hover:bg-white/10 font-bold ${
                          titleError && "border-1 border-red-500 "
                        }`}
                      />
                      {titleError && (
                        <div className="text-red-800 font-bold text-xs">
                          {titleError}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-row gap-2">
                      <DatePicker
                        popperClassName="!z-[9999]"
                        selected={selectedDate}
                        onChange={(date: Date | null) => setSelectedDate(date)}
                        customInput={
                          <CustomDateInput className="example-custom-input absolute" />
                        }
                      />
                      <Popover>
                        <PopoverButton
                          className="bg-white/20 hover:bg-white/10 dark:bg-black/30 dark:hover:bg-black/10 dark:text-white p-1 rounded-lg cursor-pointer max-h-[36px]"
                          title="Set Description"
                        >
                          <svg
                            className="w-7 h-7 dark:text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <g fill="none">
                              <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                              <path
                                fill="currentColor"
                                d="M13.5 3a8.5 8.5 0 0 1 0 17H13v.99A1.01 1.01 0 0 1 11.989 22c-2.46-.002-4.952-.823-6.843-2.504C3.238 17.798 2.002 15.275 2 12.009V11.5A8.5 8.5 0 0 1 10.5 3zm0 2h-3A6.5 6.5 0 0 0 4 11.5l.001.665c.04 2.642 1.041 4.562 2.475 5.836C7.714 19.103 9.317 19.76 11 19.945v-.935c0-.558.452-1.01 1.01-1.01h1.49a6.5 6.5 0 1 0 0-13m-5 5a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m7 0a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"
                              ></path>
                            </g>
                          </svg>
                        </PopoverButton>
                        <PopoverPanel anchor="bottom" className="flex flex-col">
                          <textarea
                            onChange={(e) => setTaskDescValue(e.target.value)}
                            value={taskDescValue}
                            placeholder="Task Description"
                            className={`bg-white/30 dark:bg-black/40 p-2 text-sm outline-0 font-bold backdrop-blur-2xl z-1000 rounded-lg mt-3`}
                            name="description-text-kanban-area"
                          ></textarea>
                        </PopoverPanel>
                      </Popover>
                      <button
                        onClick={() => {
                          if (taskNameValue.trim() !== "") {
                            addNewTask();
                            setTitleError("");
                          } else {
                            setTitleError("Title is required");
                          }
                        }}
                        className="bg-white/20 hover:bg-white/10 dark:bg-black/30 dark:hover:bg-black/20 p-1 w-min rounded-lg cursor-pointer max-h-[36px]"
                        title="Confirm Task Addition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-7 h-7 dark:text-white"
                          viewBox="0 0 24 24"
                        >
                          <g fill="none" fillRule="evenodd">
                            <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
                            <path
                              fill="currentColor"
                              d="M19.495 3.133a1 1 0 0 1 1.352.309l.99 1.51a1 1 0 0 1-.155 1.279l-.003.004l-.014.013l-.057.053l-.225.215a84 84 0 0 0-3.62 3.736c-2.197 2.416-4.806 5.578-6.562 8.646c-.49.856-1.687 1.04-2.397.301l-6.485-6.738a1 1 0 0 1 .051-1.436l1.96-1.768A1 1 0 0 1 5.6 9.2l3.309 2.481c5.169-5.097 8.1-7.053 10.586-8.548m.21 2.216c-2.29 1.432-5.148 3.509-9.998 8.358A1 1 0 0 1 8.4 13.8l-3.342-2.506l-.581.524l5.317 5.526c1.846-3.07 4.387-6.126 6.49-8.438a86 86 0 0 1 3.425-3.552l-.003-.005Z"
                            ></path>
                          </g>
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setIsAddOpen((prev) => !prev)}
              className="bg-white/20 hover:bg-white/10 dark:bg-black/30 dark:hover:bg-black/20 dark:text-white p-1 rounded-lg cursor-pointer backdrop-blur-2xl max-h-[36px]"
              title="Add Task"
            >
              <svg
                className="w-7 h-7"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g fill="none" fillRule="evenodd">
                  <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                  <path
                    fill="currentColor"
                    d="M11 5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2zM5 5h4v4H5zm16 0a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2zm-6 0h4v4h-4zm-6 8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zm0 2H5v4h4zm4 2a1 1 0 0 1 1-1h2v-2a1 1 0 1 1 2 0v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2h-2a1 1 0 0 1-1-1"
                  />
                </g>
              </svg>
            </button>
          </div>
        </div>
        <Dialog
          open={error !== ""}
          onClose={() => clearError("")}
          className="relative z-50"
        >
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <DialogPanel className="max-w-lg space-y-4 bg-white/30 dark:bg-black/30 dark:text-white backdrop-blur-2xl rounded-lg p-12">
              <DialogTitle className="font-bold">Error!</DialogTitle>
              <p>{error}</p>
              <div className="flex gap-4">
                <button
                  className="bg-white dark:bg-black dark:text-white p-2 rounded-lg cursor-pointer px-4"
                  onClick={() => clearError("")}
                >
                  OK
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
        <main>
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {/* mode="wait", bir animasyon bitmeden diğerini başlamamasını sağlıyor */}
            <AnimatePresence mode="wait">
              <Switch key={location}>
                <Route path="/kanban" component={Kanban}></Route>
                <Route path="/weekly" component={WeeklyView}></Route>
                <Route path="/past-tasks" component={PastTasks}></Route>
              </Switch>
            </AnimatePresence>
            <DragOverlay dropAnimation={null}>
              {droppedTask && (
                <KanbanTask
                  isOverlay={true}
                  key={droppedTask._id}
                  title={droppedTask.title}
                  date={droppedTask.dueDate}
                  description={droppedTask.description}
                  task={droppedTask}
                ></KanbanTask>
              )}
            </DragOverlay>
          </DndContext>
        </main>
      </div>
      <AnimatePresence>
        {isEditOpen && <EditMenu editFunction={editTask} />}
      </AnimatePresence>
      <Toaster
        toastOptions={{
          className: "dark:bg-black dark:text-white",
        }}
      ></Toaster>
    </div>
  );
}

export default App;
