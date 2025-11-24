import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

type SubHeaderProps = {
  href: string
  label: string
}
export default function Subheader ({
  href,
  label,
}: SubHeaderProps) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-1 relative -left-1.5">
        <ChevronLeft />{label}
    </Link>
  )
}