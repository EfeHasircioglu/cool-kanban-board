import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import useTasks from "./store";
import toast from "react-hot-toast";
import { useDraggable } from "@dnd-kit/core";

export default function KanbanTask({
  title,
  date,
  description,
  task,
  isOverlay,
}: any) {
  const { setIsEditOpen, setEditingTask, removeTask }: any = useTasks();

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `${task._id}/draggable`,
  });

  return (
    <>
      <div
        className={`flex flex-col gap-1 p-2 bg-white dark:bg-black dark:text-white w-full shadow-lg rounded-lg ${
          isOverlay &&
          "bg-white/50 dark:bg-black/60 backdrop-blur-sm border-2 border-dashed dark:border-black"
        }`}
      >
        <div className="fixed right-0 h-min w-min border-none outline-none">
          <Menu>
            <MenuButton>
              <svg
                className="absolute top-0 right-3 p-1 w-6 h-6 rounded-lg cursor-pointer dark:active:bg-white/15 dark:hover:bg-white/10 active:bg-black/15 hover:bg-black/10"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g fill="none" fillRule="evenodd">
                  <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                  <path
                    fill="currentColor"
                    d="M14.035 2.809c.37-.266.89-.39 1.401-.203a10 10 0 0 1 2.982 1.725c.417.35.57.861.524 1.313c-.075.753.057 1.48.42 2.106c.32.557.802.997 1.39 1.307l.225.11c.414.187.782.576.875 1.113a10 10 0 0 1 0 3.44c-.083.484-.39.847-.753 1.051l-.122.063c-.69.31-1.254.79-1.616 1.416c-.362.627-.494 1.353-.419 2.106c.045.452-.107.964-.524 1.313a10 10 0 0 1-2.982 1.725a1.51 1.51 0 0 1-1.4-.203C13.42 20.75 12.723 20.5 12 20.5s-1.42.249-2.035.691a1.51 1.51 0 0 1-1.401.203a10 10 0 0 1-2.982-1.725a1.51 1.51 0 0 1-.524-1.313c.075-.753-.058-1.48-.42-2.106a3.4 3.4 0 0 0-1.39-1.307l-.225-.11a1.51 1.51 0 0 1-.875-1.113a10 10 0 0 1 0-3.44c.083-.484.39-.847.753-1.051l.122-.062c.69-.311 1.254-.79 1.616-1.417c.361-.626.494-1.353.419-2.106a1.51 1.51 0 0 1 .524-1.313a10 10 0 0 1 2.982-1.725a1.51 1.51 0 0 1 1.4.203c.615.442 1.312.691 2.036.691s1.42-.249 2.035-.691m.957 1.769c-.866.57-1.887.922-2.992.922s-2.126-.353-2.992-.922A8 8 0 0 0 7.068 5.7c.06 1.033-.145 2.093-.697 3.05c-.553.956-1.368 1.663-2.293 2.128a8 8 0 0 0 0 2.242c.925.465 1.74 1.172 2.293 2.13c.552.955.757 2.015.697 3.048a8 8 0 0 0 1.94 1.123c.866-.57 1.887-.922 2.992-.922s2.126.353 2.992.922a8 8 0 0 0 1.94-1.122c-.06-1.034.145-2.094.697-3.05c.552-.957 1.368-1.664 2.293-2.13a8 8 0 0 0 0-2.24c-.925-.466-1.74-1.173-2.293-2.13c-.552-.956-.757-2.016-.697-3.05a8 8 0 0 0-1.94-1.122ZM12 8a4 4 0 1 1 0 8a4 4 0 0 1 0-8m0 2a2 2 0 1 0 0 4a2 2 0 0 0 0-4"
                  />
                </g>
              </svg>
            </MenuButton>
            <Transition>
              <MenuItems
                anchor="bottom"
                className="mt-3 z-1000 transition-all duration-100 origin-top-left ease-in data-closed:opacity-0 data-closed:scale-90 mx-3 bg-white/60 dark:bg-black/60 dark:text-white backdrop-blur-2xl text-black rounded-lg outline-none shadow-2xl border-none p-0.75"
              >
                <MenuItem>
                  <button
                    onClick={() => {
                      setEditingTask(task);
                      setIsEditOpen(true);
                    }}
                    className="block cursor-pointer dark:data-focus:bg-white/10 data-focus:bg-black/10 px-2 rounded-md w-full text-left"
                  >
                    Edit
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => {
                      removeTask(task);
                      toast("Item deleted", {
                        icon: "🗑️",
                      });
                    }}
                    className="block cursor-pointer dark:data-focus:bg-red-400/10 data-focus:bg-red-700/10 px-2 rounded-md w-full text-left"
                  >
                    Delete
                  </button>
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>
        </div>
        <div ref={setNodeRef} {...listeners} {...attributes}>
          <div className="font-semibold text-l mr-6 break-words">{title}</div>
          <div className="text-sm">{date.toLocaleDateString()}</div>
        </div>
        <div>
          <div>
            {task.description !== "" && (
              <Disclosure
                id={`${task._id}-disclosure`}
                as="div"
                defaultOpen={false}
              >
                <DisclosureButton>
                  <span className="text-sm/6 flex flex-row items-center gap-1 dark:hover:bg-white/10 dark:active:bg-white/15 hover:bg-black/10 active:bg-black/15 cursor-pointer px-1 rounded-lg font-medium">
                    <div>Description</div>
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g fill="none">
                        <path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                        <path
                          fill="currentColor"
                          d="M18 3a3 3 0 0 1 2.995 2.824L21 6v12a3 3 0 0 1-2.824 2.995L18 21H6a3 3 0 0 1-2.995-2.824L3 18V6a3 3 0 0 1 2.824-2.995L6 3zm0 2H6a1 1 0 0 0-.993.883L5 6v12a1 1 0 0 0 .883.993L6 19h12a1 1 0 0 0 .993-.883L19 18V6a1 1 0 0 0-.883-.993zm-8.121 5.293L12 12.414l2.121-2.121a1 1 0 0 1 1.415 1.414l-2.829 2.829a1 1 0 0 1-1.414 0l-2.829-2.829a1 1 0 1 1 1.415-1.414"
                        />
                      </g>
                    </svg>
                  </span>
                </DisclosureButton>

                <DisclosurePanel className="mt-2 text-sm/5">
                  {description}
                </DisclosurePanel>
              </Disclosure>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
