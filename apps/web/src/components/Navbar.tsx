"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import NotificationsWidget from './NotificationsWidget';
import { useAuth } from './AuthProvider';
import { useTheme } from './ThemeProvider';
import { Search, Moon, Sun, Settings, LogOut, Grid } from 'lucide-react';

export default function Navbar() {
  const { user, logout, accessToken } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim() || !accessToken) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      fetchSearch();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, accessToken]);

  const fetchSearch = async () => {
    setIsSearching(true);
    try {
      const res = await fetch(`http://localhost:3001/api/users/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) {
        setSearchResults(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-4">
          <Link href="/feed" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              e
            </div>
            <span className="font-bold hidden sm:inline-block">EDAP Social</span>
          </Link>
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="search"
              placeholder="Search EDAP social..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-[240px] lg:w-[320px] rounded-full bg-slate-100 dark:bg-slate-800 border-none pl-10 pr-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow dark:text-white"
            />
            
            {/* Search Results Dropdown */}
            {searchQuery.trim() && (
              <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-slate-500 text-sm">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((result) => (
                      <Link 
                        key={result.id} 
                        href={`/profile/${result.id}`}
                        onClick={() => setSearchQuery('')}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                          {result.avatarUrl && <img src={result.avatarUrl} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <span className="font-medium text-[15px]">{result.firstName} {result.lastName}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-slate-500 text-sm">No results found</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center: Navigation Icons (Optional, leaving space for now) */}
        <div className="hidden md:flex flex-1 justify-center max-w-[600px]">
           {/* We can add Home, Watch, Groups, Gaming icons here later like Facebook */}
        </div>

        {/* Right: User Actions */}
        <div className="flex items-center space-x-2">
          {user ? (
            <>
              {/* EDAP Menu (Grid) */}
              <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Grid size={20} />
              </button>
              
              {/* Notifications */}
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative">
                 <NotificationsWidget />
              </div>

              {/* Settings / Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden hover:opacity-90 transition-opacity flex items-center justify-center"
                >
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold">{user.firstName?.[0]}</span>
                  )}
                </button>

                {showSettings && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 p-2">
                    <Link href={`/profile/${user.id}`} className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors border-b border-slate-100 dark:border-slate-700 pb-4 mb-2">
                      <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden shrink-0">
                        {user.avatarUrl && <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">See your profile</div>
                      </div>
                    </Link>

                    <div className="space-y-1">
                      <Link href="/settings" onClick={() => setShowSettings(false)} className="w-full flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-900 dark:text-slate-100">
                            <Settings size={20} />
                          </div>
                          <span className="font-medium text-[15px] text-slate-900 dark:text-slate-100">Settings & privacy</span>
                        </div>
                      </Link>

                      <button 
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                          </div>
                          <span className="font-medium text-[15px]">Display & accessibility</span>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                        </div>
                      </button>

                      <button 
                        onClick={() => logout()}
                        className="w-full flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                            <LogOut size={20} />
                          </div>
                          <span className="font-medium text-[15px]">Log Out</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <nav className="flex items-center space-x-4">
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link href="/login" className="text-sm font-medium hover:underline">
                Login
              </Link>
              <Link href="/register" className="text-sm font-medium hover:underline bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors">
                Register
              </Link>
            </nav>
          )}
        </div>
      </div>
    </nav>
  );
}
