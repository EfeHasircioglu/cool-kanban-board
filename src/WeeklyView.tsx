import { motion } from "motion/react";
export default function WeeklyView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="md:grid md:grid-cols-7 m-5 md:gap-2 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg font-header font-semibold">
            10.10.2025
          </div>
          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg text-sm">
            Mon
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg font-header font-semibold">
            11.10.2025
          </div>

          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg text-sm">
            Tue
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg font-header font-semibold">
            12.10.2025
          </div>

          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg text-sm">
            Wed
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg font-header font-semibold">
            13.10.2025
          </div>

          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg text-sm">
            Thrs
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg font-header font-semibold">
            14.10.2025
          </div>

          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg text-sm">
            Fri
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg font-header font-semibold">
            15.10.2025
          </div>

          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg text-sm">
            Sat
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg font-header font-semibold">
            16.10.2025
          </div>
          <div className="bg-[#fff1e6]/75 h-auto p-2 rounded-lg text-sm">
            Sun
          </div>
        </div>
      </div>
    </motion.div>
  );
}
