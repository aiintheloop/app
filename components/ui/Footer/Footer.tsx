import Link from 'next/link';
import s from './Footer.module.css';

import Logo from 'components/icons/Logo';
import GitHub from 'components/icons/GitHub';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1920px] px-6 ">
      <div className="py-12 mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center space-y-4 ">
        <div>
          <span>v.0.1.0</span>
          <span> | </span>
          <Link href={'https://ai2loop.com/legal/'} target="_blank">
            Terms
          </Link>
        </div>
        <div className="flex items-center">
          <Link href={'mailto:support@ai2loop.com'}>Support</Link>
        </div>
      </div>
    </footer>
  );
}
