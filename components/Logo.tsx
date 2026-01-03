export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Background Shape */}
      <rect width="100" height="100" rx="24" fill="url(#logo-gradient)" />
      
      {/* The Nexus Line (N + Pulse + Connection) */}
      <path 
        d="M30 70V30L50 55L70 30V70" 
        stroke="white" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Data Pulse Dot */}
      <circle cx="50" cy="55" r="5" fill="#2DD4BF" stroke="white" strokeWidth="2" />

      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0D9488" /> {/* Teal 600 */}
          <stop offset="1" stopColor="#10B981" /> {/* Emerald 500 */}
        </linearGradient>
      </defs>
    </svg>
  );
}