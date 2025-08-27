import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { useDraggable } from "@dnd-kit/core";
export default function ListItem({ task, setTasks, taskList }) {
  const today = new Date();
  const [tempTitle, setTempTitle] = useState(task.title);
  const [tempDate, setTempDate] = useState(task.date);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState("");
  const dropdownRef = useRef(null);
  /* her bir görevi draggable yapmak için olan kod */
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    // button için dnd kontrolü
    onPointerDown(e) {
      const targetId = e.target.id;
      if (targetId === "dropdown") {
        e.preventDefault();
      }
    },
  });
  //eğer bir task todo veya inProgressdeyse ve tarihi geçmişse o zaman tarih alanının arkaplanı kırmızı gözüksün

  /* burası kartları sürüklerken onların yerinin stil olarak da değişmesi için */
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };
  /* dropdown açıkken, dropdown dışına basınca kapanmasını sağlayacakk fonksiyon */
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  /* editleme durumunu düzenleyen fonksiyon */
  function handleDeletion(taskId) {
    /* TODO: buraya bir türlü bir confirmation da yapılsa güzel olur */
    setTasks(taskList.filter((task) => task.id !== taskId));
  }
  function handleEditing(taskId) {
    if (tempTitle.trim() !== "" && error === "") {
      setTasks(
        taskList.map((task) => {
          if (task.id === taskId) {
            if (!task.isEditing) {
              //task için edit modu açılıyor
              return { ...task, isEditing: true };
            } else {
              //task'ı sıfırdan oluşturduğumuz için bu durumda kaydediyoruz
              return {
                ...task,
                title: tempTitle,
                date: tempDate,
                isEditing: false,
              };
            }
          } else {
            return task; //eğer task id !=== bizim taskımızın id değilse o zaman task olduğu gibi kalsın
          }
        }) /* tasklar içerisinde arama yapılıyor, eğer task bizim istediğimiz task ise, verilerini bizim istediğimiz şekilde yapıp kaydediyor, değilse zaten hiç ellemiyor, olduğu gibi kalıyor */
      );
    } else {
      setError("Title cannot be empty");
    }
  }
  function cancelEditing(taskId) {
    /* buradaki amacımız, eğer taskımız önceden kaydedilmiş ve edit butonundan değiştirilecek ise, o zaman sadece bu ekranı kapatıyor ve herhangi bir güncelleme yapmıyor ama eğer yeni eklenmiş bir görev ise, o zaman bu görevi discard ediyor  */
    const originalTask = taskList.find((t) => t.id === taskId);

    /* eğer task zaten önceden varsa, yani kaydedilmiş ise; */
    if (originalTask && originalTask.title !== "") {
      setTasks(
        taskList.map((task) =>
          task.id === taskId
            ? { ...task, isEditing: false } //sadece isEditing'i false yap, diğer değerler olduğu gibi dursun
            : task
        )
      );
    } else {
      /* eğer yeni oluşturulmuş bir task ise direk onu sil */
      setTasks(taskList.filter((task) => task.id !== taskId));
    }
  }
  //eğer task due ve tamamlanmamış ise tarih yerinin arkaplanını kırmızı yapmamız için ilk tarihi geçmiş taskları bulmamız lazım
  const isTaskDue = (t) => {
    const taskDate = new Date(t.date);
    return (
      (t.status === "todo" || t.status === "inProgress") && taskDate < today
    );
  };
  return task.isEditing ? (
    <AnimatePresence key={task.id}>
      <motion.div
        initial={{ opacity: 0, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 2 }}
      >
        <div className="p-2 m-1 bg-gray-900/60 rounded-md shadow z-50">
          <div className="flex flex-col gap-2">
            <input
              className="border-1 border-white/10 bg-white/10 rounded-md p-1 pl-2"
              placeholder="Title of the task"
              type="text"
              name="title"
              value={tempTitle}
              id="titleInput"
              onChange={(e) => {
                if (e.target.value.trim() !== "") {
                  setTempTitle(e.target.value);
                  setError("");
                } else {
                  setTempTitle(e.target.value);
                  setError("Title cannot be empty");
                }
              }}
            />
            <span className="text-xs text-red-500 font-bold">{error}</span>
            <input
              className="border-1 border-white/10 bg-white/10 rounded-md p-1 pl-2"
              placeholder="Enter the due date"
              type="date"
              name="date"
              value={tempDate}
              id="dateInput"
              min={format(new Date(), "yyyy-MM-dd")}
              onChange={(e) => setTempDate(e.target.value)}
            />
            <div className="flex flex-row gap-3">
              <button
                className="bg-white/10 rounded-md hover:bg-white/5 text-white p-1 w-fit px-3"
                type="button"
                id="saveButton"
                onClick={() => handleEditing(task.id)}
              >
                Save
              </button>
              <button
                className="bg-white/10 rounded-md hover:bg-white/5 text-white p-1 w-fit px-3"
                type="button"
                id="editButton"
                onClick={() => cancelEditing(task.id)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  ) : (
    /* editlenebilir durumdaki itemler için */
    <div
      ref={setNodeRef}
      style={style}
      className="relative p-2 m-1 bg-gray-900/60 rounded-md shadow-xl"
    >
      <div ref={dropdownRef}>
        <button
          className="inline cursor-pointer h-0 absolute right-0"
          onClick={(e) => setDropdownOpen((prev) => !prev)}
        >
          <svg
            width="27.5px"
            height="27.5px"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-2 hover:bg-white/10 p-1 transition-colors rounded"
          >
            <path
              d="M14.3632 5.65156L15.8431 4.17157C16.6242 3.39052 17.8905 3.39052 18.6716 4.17157L20.0858 5.58579C20.8668 6.36683 20.8668 7.63316 20.0858 8.41421L18.6058 9.8942M14.3632 5.65156L4.74749 15.2672C4.41542 15.5993 4.21079 16.0376 4.16947 16.5054L3.92738 19.2459C3.87261 19.8659 4.39148 20.3848 5.0115 20.33L7.75191 20.0879C8.21972 20.0466 8.65806 19.8419 8.99013 19.5099L18.6058 9.8942M14.3632 5.65156L18.6058 9.8942"
              stroke="#fff"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </button>
        <AnimatePresence className="z-100">
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 2 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="z-100"
            >
              <div
                id="dropdown"
                className="flex flex-col gap-1 absolute right-0 top-7 text-xs bg-black p-1 rounded-xl"
              >
                <button
                  onClick={() => {
                    handleEditing(task.id);
                    setDropdownOpen(false);
                  }}
                  className="hover:bg-white/30 px-2 py-1 w-full rounded-lg cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDeletion(task.id);
                    setDropdownOpen(false);
                  }}
                  className="hover:bg-white/30 px-2 py-1 w-full rounded-lg cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div {...listeners} {...attributes} className="flex flex-col z-100 gap-2">
        <span className="text-lg mr-7">{task.title}</span>
        <span
          className={
            isTaskDue(task)
              ? "text-xs bg-red-700 w-fit px-1 rounded"
              : "text-xs"
          }
        >
          {task.date}
        </span>
      </div>
    </div>
  );
}
