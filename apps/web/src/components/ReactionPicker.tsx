"use client";

const reactions = [
  { type: "LIKE", emoji: "👍", label: "Like", color: "text-blue-600" },
  { type: "LOVE", emoji: "❤️", label: "Love", color: "text-red-500" },
  { type: "HAHA", emoji: "😆", label: "Haha", color: "text-yellow-500" },
  { type: "WOW", emoji: "😮", label: "Wow", color: "text-yellow-500" },
  { type: "SAD", emoji: "😢", label: "Sad", color: "text-yellow-500" },
  { type: "ANGRY", emoji: "😡", label: "Angry", color: "text-orange-600" }
];

interface ReactionPickerProps {
  onReact: (type: string | null) => void;
  currentReaction?: string | null;
}

export default function ReactionPicker({ onReact, currentReaction }: ReactionPickerProps) {
  const current = reactions.find((r) => r.type === currentReaction);

  return (
    <div className="relative group inline-flex items-center justify-center">
      {/* Floating Picker */}
      <div className="absolute bottom-full mb-2 left-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded-full px-2 py-1 flex gap-1 opacity-0 scale-95 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-out z-10 origin-bottom-left">
        {reactions.map((r) => (
          <button
            key={r.type}
            onClick={(e) => {
              e.preventDefault();
              onReact(r.type);
            }}
            className="hover:scale-125 transition-transform duration-200 p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 flex flex-col items-center justify-center relative group/emoji"
          >
            <span className="text-2xl leading-none drop-shadow-sm">{r.emoji}</span>
            <span className="absolute -top-8 bg-black/80 text-white text-[11px] font-medium px-2 py-0.5 rounded-full opacity-0 group-hover/emoji:opacity-100 transition-opacity">
              {r.label}
            </span>
          </button>
        ))}
      </div>
      
      {/* Trigger Button */}
      <button 
        onClick={() => onReact(currentReaction ? null : "LIKE")}
        className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm ${
          current ? current.color : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
        }`}
      >
        <span className="text-[18px] leading-none grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
          {current ? current.emoji : "👍"}
        </span>
        <span>{current ? current.label : "Like"}</span>
      </button>
    </div>
  );
}
