import { Gift, Video, Search, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function RightSidebar() {
  return (
    <div className="w-[360px] hidden lg:block shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto custom-scrollbar p-4 pr-6">
      
      {/* Sponsored Section */}
      <div className="mb-4">
        <h3 className="text-[15px] font-semibold text-slate-500 dark:text-slate-400 mb-2">Sponsored</h3>
        <div className="space-y-4">
          <Link href="#" className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <div className="w-[120px] h-[120px] rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-300 dark:border-slate-600"></div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Elite Performance AI Tracker</h4>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">performance-ai.com</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="my-3 border-b border-slate-300 dark:border-slate-700"></div>

      {/* Friend Requests Placeholder */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
           <h3 className="text-[15px] font-semibold text-slate-500 dark:text-slate-400">Friend requests</h3>
           <Link href="/friends" className="text-blue-600 dark:text-blue-400 text-sm hover:bg-slate-200 dark:hover:bg-slate-800 px-2 py-1 rounded">See all</Link>
        </div>
        <div className="flex items-start gap-3 rounded-lg p-2 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <div className="w-14 h-14 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0"></div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Thabo Mbeki</span>
              <span className="text-[12px] text-slate-500 dark:text-slate-400">2d</span>
            </div>
            <div className="flex gap-2 mt-2">
              <button className="flex-1 bg-blue-600 text-white rounded-md py-1.5 text-sm font-semibold hover:bg-blue-700 transition-colors">Confirm</button>
              <button className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-md py-1.5 text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <div className="my-3 border-b border-slate-300 dark:border-slate-700"></div>

      {/* Birthdays */}
      <div className="mb-4">
         <h3 className="text-[15px] font-semibold text-slate-500 dark:text-slate-400 mb-2">Birthdays</h3>
         <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
           <Gift size={24} className="text-blue-500" />
           <p className="text-[15px] text-slate-900 dark:text-slate-100">
             <span className="font-semibold">Naledi Khumalo</span> and <span className="font-semibold">2 others</span> have birthdays today.
           </p>
         </div>
      </div>

      <div className="my-3 border-b border-slate-300 dark:border-slate-700"></div>

      {/* Contacts */}
      <div>
        <div className="flex items-center justify-between mb-2 px-2">
          <h3 className="text-[15px] font-semibold text-slate-500 dark:text-slate-400">Contacts</h3>
          <div className="flex gap-2 text-slate-500 dark:text-slate-400">
             <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full"><Video size={18} /></button>
             <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full"><Search size={18} /></button>
             <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full"><MoreHorizontal size={18} /></button>
          </div>
        </div>
        <div className="space-y-1">
          {/* Mock Contacts with active status */}
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} className="w-full flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0"></div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-50 dark:border-slate-900"></div>
              </div>
              <span className="font-medium text-slate-900 dark:text-slate-100 text-[15px]">Contact {i}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
