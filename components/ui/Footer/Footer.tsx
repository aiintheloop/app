import Link from 'next/link';
import s from './Footer.module.css';

import Logo from 'components/icons/Logo';
import GitHub from 'components/icons/GitHub';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1920px] px-6 bg-zinc-50">
      <div className="py-12 mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center space-y-4 ">
        <div>
          <span className="text-black">v.0.1.0</span>
          <span className="text-black"> | </span>
          <span className="text-black">Terms</span>
        </div>
        <div className="flex items-center">
          <span className="text-black">Support</span>
        </div>
      </div>
    </footer>
  );
}
