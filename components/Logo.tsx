// components/Logo.tsx
import Link from "next/link";

export default function Logo({ className = "h-16 w-auto" }: { className?: string }) {
  return (
    <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
      <img 
        src="/logo.png" 
        alt="The Health Nexus BD Logo" 
        className={`${className} object-contain`} 
      />
    </Link>
  );
}
