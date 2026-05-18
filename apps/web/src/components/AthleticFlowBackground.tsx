import React from "react";

export default function AthleticFlowBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-50 dark:bg-black transition-colors duration-500">
      {/* Dynamic flowing athletic track lines and pulse graphic */}
      <svg
        className="absolute w-full h-full opacity-35 dark:opacity-25"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Neon athletic gradient flow */}
          <linearGradient id="flow-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff0055" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#0077ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00ffcc" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="flow-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffcc00" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ff0055" stopOpacity="0.2" />
          </linearGradient>
          
          {/* Activity ring gradients */}
          <linearGradient id="ring-red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff0055" />
            <stop offset="100%" stopColor="#ff5500" />
          </linearGradient>
          <linearGradient id="ring-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffcc" />
            <stop offset="100%" stopColor="#00ff66" />
          </linearGradient>
          <linearGradient id="ring-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0077ff" />
            <stop offset="100%" stopColor="#00ffff" />
          </linearGradient>
          
          {/* Animated glow filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Grid for performance tracking */}
        <grid width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(15, 23, 42, 0.03)" strokeWidth="1" />
        </grid>

        {/* Dynamic track / heartbeat lines flow */}
        <path
          className="athletic-path-1"
          d="M-100 200 C 300 150, 450 650, 800 500 C 1100 380, 1200 750, 1600 700"
          fill="none"
          stroke="url(#flow-gradient-1)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#glow)"
        />
        
        <path
          className="athletic-path-2"
          d="M-50 400 C 200 450, 600 200, 900 600 C 1200 800, 1300 350, 1550 450"
          fill="none"
          stroke="url(#flow-gradient-2)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="15, 10"
        />

        <path
          className="athletic-path-3"
          d="M100 -50 C 400 300, 300 600, 700 800 C 1100 950, 1300 700, 1600 600"
          fill="none"
          stroke="url(#flow-gradient-1)"
          strokeWidth="2"
          strokeOpacity="0.5"
        />
        
        {/* Biometric pulse of the athlete */}
        <path
          className="athletic-path-pulse"
          d="M 50 650 L 300 650 L 330 600 L 360 700 L 390 620 L 410 650 L 700 650 L 730 550 L 760 750 L 790 610 L 820 650 L 1400 650"
          fill="none"
          stroke="rgba(0, 255, 204, 0.4)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Floating biomechanics particles */}
        <circle cx="330" cy="600" r="4" fill="#00ffcc" className="pulse-dot-1" filter="url(#glow)" />
        <circle cx="760" cy="750" r="5" fill="#ff0055" className="pulse-dot-2" filter="url(#glow)" />
        <circle cx="1100" cy="380" r="3" fill="#0077ff" className="pulse-dot-3" filter="url(#glow)" />

        {/* FUTURISTIC SMART WATCH / BIOMETRIC HUD GRAPHIC (Spinning & Glowing) */}
        <g transform="translate(1220, 250)" className="hud-smartwatch-group">
          {/* Watch outer glass border */}
          <circle cx="0" cy="0" r="140" fill="none" stroke="rgba(0, 119, 255, 0.15)" strokeWidth="2" />
          
          {/* Rotating outer compass / activity ticks */}
          <circle
            cx="0"
            cy="0"
            r="130"
            fill="none"
            stroke="rgba(0, 255, 204, 0.25)"
            strokeWidth="3"
            strokeDasharray="4, 10"
            className="hud-spin-clockwise"
          />
          
          {/* Second rotating inner ring with dash patterns */}
          <circle
            cx="0"
            cy="0"
            r="115"
            fill="none"
            stroke="rgba(255, 0, 85, 0.2)"
            strokeWidth="2"
            strokeDasharray="40, 20, 10, 20"
            className="hud-spin-counter"
          />

          {/* Glowing Activity Rings (like high-performance concentric watch metrics) */}
          {/* Ring 1: Energy/Active Calories (Red) */}
          <circle cx="0" cy="0" r="95" fill="none" stroke="rgba(255, 0, 85, 0.08)" strokeWidth="10" />
          <circle
            cx="0"
            cy="0"
            r="95"
            fill="none"
            stroke="url(#ring-red)"
            strokeWidth="10"
            strokeDasharray="596"
            strokeDashoffset="180"
            strokeLinecap="round"
            className="hud-ring-growth"
            filter="url(#glow)"
          />

          {/* Ring 2: Exercise Minutes (Green) */}
          <circle cx="0" cy="0" r="80" fill="none" stroke="rgba(0, 255, 102, 0.08)" strokeWidth="10" />
          <circle
            cx="0"
            cy="0"
            r="80"
            fill="none"
            stroke="url(#ring-green)"
            strokeWidth="10"
            strokeDasharray="502"
            strokeDashoffset="220"
            strokeLinecap="round"
            className="hud-ring-growth"
            filter="url(#glow)"
          />

          {/* Ring 3: Standing/Performance Hours (Blue) */}
          <circle cx="0" cy="0" r="65" fill="none" stroke="rgba(0, 119, 255, 0.08)" strokeWidth="10" />
          <circle
            cx="0"
            cy="0"
            r="65"
            fill="none"
            stroke="url(#ring-blue)"
            strokeWidth="10"
            strokeDasharray="408"
            strokeDashoffset="110"
            strokeLinecap="round"
            className="hud-ring-growth"
            filter="url(#glow)"
          />

          {/* Digital Telemetry Readings (VO2 max, Heart Rate, Activity Indicators) */}
          {/* Central Heart rate reading */}
          <text x="0" y="-15" textAnchor="middle" fill="rgba(255, 0, 85, 0.85)" className="font-mono text-sm font-semibold tracking-wider">
            142 BPM
          </text>
          <path d="M-15 -32 L-10 -37 L-5 -32 L0 -37 L5 -32 L0 -23 Z" fill="rgba(255, 0, 85, 0.85)" filter="url(#glow)" className="hud-pulse-heart" />
          
          {/* Active Calories and Duration */}
          <text x="0" y="10" textAnchor="middle" fill="rgba(0, 255, 204, 0.85)" className="font-mono text-xs font-medium">
            482 KCAL
          </text>
          <text x="0" y="28" textAnchor="middle" fill="rgba(0, 119, 255, 0.8)" className="font-mono text-[10px] uppercase font-bold tracking-widest">
            ELITE PACE
          </text>

          {/* Dynamic rotating outer telemetry ticks */}
          <line x1="0" y1="-138" x2="0" y2="-146" stroke="rgba(0, 255, 204, 0.8)" strokeWidth="2" className="hud-spin-clockwise" />
          <line x1="138" y1="0" x2="146" y2="0" stroke="rgba(0, 255, 204, 0.8)" strokeWidth="2" className="hud-spin-clockwise" />
          <line x1="0" y1="138" x2="0" y2="146" stroke="rgba(0, 255, 204, 0.8)" strokeWidth="2" className="hud-spin-clockwise" />
          <line x1="-138" y1="0" x2="-146" y2="0" stroke="rgba(0, 255, 204, 0.8)" strokeWidth="2" className="hud-spin-clockwise" />
        </g>
      </svg>
      
      {/* Visual Ambient Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-50/80 dark:to-black/80 pointer-events-none" />
    </div>
  );
}
