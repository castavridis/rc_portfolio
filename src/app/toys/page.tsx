import Link from 'next/link';

export default function Toys () {
  return (
    <div>
      <ul>
        <li>
          <Link href="/toys/calder/">Calder</Link>
        </li>
        <li>
          <Link href="/toys/phonics/">Phonics</Link>
        </li>
      </ul>
    </div>
  )
}