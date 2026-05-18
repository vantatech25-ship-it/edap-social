import Sidebar from "@/components/Sidebar";

export default function Feed() {
  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Create Post */}
          <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0"></div>
              <input 
                type="text" 
                placeholder="Share your progress or thoughts..." 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-black/90">Post</button>
            </div>
          </div>

          {/* Feed Stream */}
          <div className="space-y-4">
            {[1, 2, 3].map((post) => (
              <div key={post} className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-sm">Demo User {post}</h4>
                    <span className="text-xs text-slate-500">2 hours ago</span>
                  </div>
                </div>
                <p className="text-sm text-slate-700">This is a placeholder post in the ranked feed. Cursor pagination will load more below. Testing out the new original UI design.</p>
                <div className="flex items-center gap-6 pt-3 border-t border-slate-100">
                  <button className="text-sm text-slate-600 hover:text-black font-medium">Like</button>
                  <button className="text-sm text-slate-600 hover:text-black font-medium">Comment</button>
                  <button className="text-sm text-slate-600 hover:text-black font-medium">Share</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <div className="hidden lg:block w-80 p-4">
        {/* Right sidebar for Monetisation/CSR */}
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 space-y-4 sticky top-20">
          <h3 className="font-semibold">Elite Performance Tiers</h3>
          <p className="text-sm text-slate-600">Upgrade your account for AI video analysis and health tracking.</p>
          <button className="w-full px-4 py-2 border border-slate-300 text-black rounded-md text-sm font-medium hover:bg-slate-50">Learn More</button>
        </div>
      </div>
    </div>
  );
}
