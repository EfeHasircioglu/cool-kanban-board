# Cool Kanban Board
This is a kanban board app that also has a weekly view!
## [Demo](https://cool-kanban-board.vercel.app/)
### Demo video


https://github.com/user-attachments/assets/c2e5bc92-47b5-464b-a9b1-093a0253bcb3


**It was built using:** 
- TypeScript + React.js
- Zustand (for state management)
- IndexedDB (for permanent data storage)
- wouter (for routing between kanban, weekly and past views)
- dnd-kit (for kanban board drag & drop)
- Framer Motion (for smooth animations)
- Tailwind + Headless UI (for styling and some components)
### Main features of the app
**1. Kanban Board** 
  The kanban board is the main interface of the app, allowing users to change the status of their tasks, edit, delete and view them. If a task is due and completed, it gets removed from the main view and placed to past tasks.
**2. Weekly View**
  The weekly view of tasks based on their due date. Every task must have a due date, as a date is essential for the general logic of the app. Users can also edit and delete their tasks from the weekly view, but weekly view doesn't have drag & drop support. (yet)
**3. Past Tasks**
  This is the place where past tasks (completed and due) are placed. the properties of the tasks (asides from task status, as every task is done) can be seen here.
### Insights of development process
- I tried to use useMemo and related solutions as much as possible to optimize the app.
- There is only one source of truth, and that is the IndexedDB.
- Zustand is used for almost all of the states, aside from a few local states that handle some small / temporary things.
- Some animations are made with Framer Motions, others with the Transition component of Headless UI (mostly on Headless UI components themselves)
- Tailwind's default dark mode handling is used for the handling of light/dark modes, and it changes based on your device's color mode.
- react-datepicker is used to make a datepicker, tied to a button. (on the adding menu)
