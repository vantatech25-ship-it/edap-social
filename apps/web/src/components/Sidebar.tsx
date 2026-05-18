import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-64 border-r min-h-[calc(100vh-3.5rem)] p-4 hidden md:block bg-white">
      <div className="space-y-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Discover</h2>
          <div className="space-y-1">
            <Link href="/feed" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:bg-slate-100 font-medium">
              Feed
            </Link>
            <Link href="/groups" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 transition-all hover:bg-slate-100 font-medium">
              Groups
            </Link>
            <Link href="/messages" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 transition-all hover:bg-slate-100 font-medium">
              Messages
            </Link>
            <Link href="/profile/me" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 transition-all hover:bg-slate-100 font-medium">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
