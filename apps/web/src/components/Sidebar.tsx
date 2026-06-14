import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { Users, Bookmark, Clock, Flag, Video, ChevronDown } from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <div className="w-[300px] hidden xl:block shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto custom-scrollbar p-2">
      <div className="space-y-1 mt-2">
        {user && (
          <Link href={`/profile/${user.id}`} className="flex items-center gap-3 rounded-lg px-2 py-2 text-slate-900 dark:text-slate-100 transition-all hover:bg-slate-200 dark:hover:bg-slate-800 font-medium">
            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
              {user.avatarUrl && <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />}
            </div>
            <span>{user.firstName} {user.lastName}</span>
          </Link>
        )}

        <Link href="/groups" className="flex items-center gap-3 rounded-lg px-2 py-2 text-slate-900 dark:text-slate-100 transition-all hover:bg-slate-200 dark:hover:bg-slate-800 font-medium">
          <div className="w-9 h-9 flex items-center justify-center">
            <Users size={28} className="text-blue-500" />
          </div>
          <span>Groups</span>
        </Link>
        
        <Link href="/saved" className="flex items-center gap-3 rounded-lg px-2 py-2 text-slate-900 dark:text-slate-100 transition-all hover:bg-slate-200 dark:hover:bg-slate-800 font-medium">
          <div className="w-9 h-9 flex items-center justify-center">
            <Bookmark size={28} className="text-purple-500" />
          </div>
          <span>Saved</span>
        </Link>
        
        <Link href="/memories" className="flex items-center gap-3 rounded-lg px-2 py-2 text-slate-900 dark:text-slate-100 transition-all hover:bg-slate-200 dark:hover:bg-slate-800 font-medium">
          <div className="w-9 h-9 flex items-center justify-center">
            <Clock size={28} className="text-blue-400" />
          </div>
          <span>Memories</span>
        </Link>

        <Link href="/pages" className="flex items-center gap-3 rounded-lg px-2 py-2 text-slate-900 dark:text-slate-100 transition-all hover:bg-slate-200 dark:hover:bg-slate-800 font-medium">
          <div className="w-9 h-9 flex items-center justify-center">
            <Flag size={28} className="text-orange-500" />
          </div>
          <span>Pages</span>
        </Link>

        <Link href="/video" className="flex items-center gap-3 rounded-lg px-2 py-2 text-slate-900 dark:text-slate-100 transition-all hover:bg-slate-200 dark:hover:bg-slate-800 font-medium">
          <div className="w-9 h-9 flex items-center justify-center">
            <Video size={28} className="text-cyan-500" />
          </div>
          <span>Video</span>
        </Link>
        
        <button className="w-full flex items-center gap-3 rounded-lg px-2 py-2 text-slate-900 dark:text-slate-100 transition-all hover:bg-slate-200 dark:hover:bg-slate-800 font-medium">
          <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <ChevronDown size={20} />
          </div>
          <span>See more</span>
        </button>
      </div>

      <div className="my-3 border-b border-slate-300 dark:border-slate-700 mx-2"></div>

      <div className="px-2">
        <div className="flex items-center justify-between group">
          <h3 className="text-[15px] font-semibold text-slate-500 dark:text-slate-400 mb-2">Your shortcuts</h3>
          <button className="text-blue-600 dark:text-blue-400 text-sm hidden group-hover:block hover:bg-slate-200 dark:hover:bg-slate-800 px-2 py-1 rounded">Edit</button>
        </div>
        <div className="space-y-1">
          {/* Mock Shortcuts */}
          <Link href="/groups/dev" className="flex items-center gap-3 rounded-lg px-2 py-2 text-slate-900 dark:text-slate-100 transition-all hover:bg-slate-200 dark:hover:bg-slate-800 font-medium">
            <div className="w-9 h-9 rounded-md bg-indigo-100 dark:bg-indigo-900 overflow-hidden shrink-0"></div>
            <span className="truncate">Web Developers SA</span>
          </Link>
          <Link href="/groups/running" className="flex items-center gap-3 rounded-lg px-2 py-2 text-slate-900 dark:text-slate-100 transition-all hover:bg-slate-200 dark:hover:bg-slate-800 font-medium">
            <div className="w-9 h-9 rounded-md bg-green-100 dark:bg-green-900 overflow-hidden shrink-0"></div>
            <span className="truncate">Joburg Runners Club</span>
          </Link>
        </div>
      </div>

      <div className="mt-8 px-4 text-[13px] text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
        <Link href="/privacy" className="hover:underline">Privacy</Link>
        <span>·</span>
        <Link href="/terms" className="hover:underline">Terms</Link>
        <span>·</span>
        <Link href="/advertising" className="hover:underline">Advertising</Link>
        <span>·</span>
        <Link href="/ad-choices" className="hover:underline">Ad choices</Link>
        <span>·</span>
        <Link href="/cookies" className="hover:underline">Cookies</Link>
        <span>·</span>
        <span>EDAP Social © 2026</span>
      </div>
    </div>
  );
}
