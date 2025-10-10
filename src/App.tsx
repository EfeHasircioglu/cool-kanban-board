/* bu uygulamada main butonlar, componentler falan olacak */
import { Route } from "wouter";
import Kanban from "./Kanban";
import WeeklyView from "./WeeklyView";
function App() {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="fixed top-0 left-0 h-screen w-screen max-h-none -z-1"
        id="visual"
        viewBox="0 0 900 900"
        width="900"
        height="900"
        version="1.1"
      >
        <defs>
          <filter id="blur1" x="-10%" y="-10%" width="120%" height="120%">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
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
        <div className="flex flex-row">
          <button className="bg-white/20 hover:bg-white/10 p-1 m-2 rounded-lg cursor-pointer">
            <svg className="w-7 h-7" viewBox="0 0 24 24">
              <g fill="none" fill-rule="evenodd">
                <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                <path
                  fill="currentColor"
                  d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2H5v14h14zm-9 1a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 10 17H7.5A1.5 1.5 0 0 1 6 15.5v-8A1.5 1.5 0 0 1 7.5 6zm-.5 2H8v7h1.5zm7-2a1.5 1.5 0 0 1 1.493 1.356L18 7.5v3a1.5 1.5 0 0 1-1.356 1.493L16.5 12H14a1.5 1.5 0 0 1-1.493-1.356L12.5 10.5v-3a1.5 1.5 0 0 1 1.356-1.493L14 6zM16 8h-1.5v2H16z"
                />
              </g>
            </svg>
          </button>
          <button className="bg-white/20 hover:bg-white/10 p-1 my-2 rounded-lg cursor-pointer">
            <svg
              className="w-7 h-7"
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
          </button>
        </div>
        <main>
          <Route path="/kanban" component={Kanban}></Route>
        </main>
      </div>
    </div>
  );
}

export default App;
