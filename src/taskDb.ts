import Dexie, { type EntityTable } from "dexie";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: Date;
  state: "todo" | "inProgress" | "done";
}

const db = new Dexie("tasksDatabase") as Dexie & {
  tasks: EntityTable<
    Task,
    "_id" //primary key
  >;
};
// Schema decleration
db.version(1).stores({
  tasks: "_id, title, description, dueDate, state",
});

export type { Task };
export { db };
