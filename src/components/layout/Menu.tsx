import React from "react";
import Link from 'next/link';

export const Menu: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <ul className="flex space-x-6">
        <li>
          <Link href="/profile" className="hover:text-purple-300">Profile</Link>
        </li>
        <li>
          <Link href="/debates" className="hover:text-purple-300">Debates</Link>
        </li>
        <li>
          <Link href="/leaderboard" className="hover:text-purple-300">Leaderboard</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;