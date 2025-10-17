import { create } from "zustand";
import { db } from "./taskDb";
import type { Task } from "./taskDb";
import { useLiveQuery } from "dexie-react-hooks";

interface TaskStore {
  syncing: boolean;
  error: string;
  editingTask: Task | undefined;
  isEditOpen: boolean;
  setIsEditOpen: (prev: boolean) => void;
  setEditingTask: (editing: Task) => void;
  clearError: () => void;
  tempTitle: string;
  setTempTitle: (title: string) => void;
  tempDesc: string;
  setTempDate: (title: string) => void;
  tempDate: string;
  setTempDesc: (description: string) => void;
  addTask: (task: Task) => Promise<void>;
  removeTask: (task: Task) => Promise<void>;
  updateTask: (newTask: Task, task: Task) => Promise<void>;
}

const useTasks = create<TaskStore>((set) => ({
  syncing: false,
  error: "",
  editingTask: undefined,
  isEditOpen: false,
  setIsEditOpen: (isOpen: boolean) => set({ isEditOpen: isOpen }),
  setEditingTask: (editing: Task) => set({ editingTask: editing }),
  clearError: () => set({ error: "" }),
  /* edit için temp değerler */
  tempTitle: "",
  setTempTitle: (title: string) => set({ tempTitle: title }),
  tempDesc: "",
  setTempDesc: (description: string) => set({ tempDesc: description }),
  tempDate: "",
  setTempDate: (date: string) => set({ tempDate: date }),
  addTask: async (task: Task) => {
    /* önce state'e yazıyoruz */

    set({ syncing: true }); /* sync işlemi başladı */
    try {
      await db.tasks.add(task);
    } catch (err: any) {
      /* eğer database herhangi bir şekilde yazma işlemini gerçekleştiremez ise */
      set({ error: "Database error, look at console for details." });
      console.error("DB error!", err);
    } finally {
      set({ syncing: false }); /* syncing bitti */
    }
  },
  removeTask: async (task: Task) => {
    set({ syncing: true }); /* sync işlemi başladı */

    try {
      await db.tasks.delete(task._id);
    } catch (err: any) {
      set({ error: "Database error, look at console for details." });
    } finally {
      set({ syncing: false });
    }
  },
  updateTask: async (newTask: Task, task: Task) => {
    set({ syncing: true });
    try {
      await db.tasks.update(task._id, newTask);
    } catch (err: any) {
      set({ error: "Database error, look at console for details." });
    } finally {
      set({ syncing: false });
    }
  },
}));

export { useTasks };
export default useTasks;
