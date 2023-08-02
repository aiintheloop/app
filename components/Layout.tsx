import Head from 'next/head';
import { useRouter } from 'next/router';

import Navbar from 'components/ui/Navbar';
import Footer from 'components/ui/Footer';
import { ReactNode } from 'react';
import { PageMeta } from '../types';
import NextNProgress from 'nextjs-progressbar';

interface Props {
  children: ReactNode;
  meta?: PageMeta;
}

export default function Layout({ children, meta: pageMeta }: Props) {
  const router = useRouter();
  const meta = {
    title: 'AI2Loop',
    description: 'Brought to you by Tec2Scale',
    ...pageMeta
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta content={meta.description} name="description" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        {/* <meta property="og:image" content={meta.cardImage} /> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vercel" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        {/* <meta name="twitter:image" content={meta.cardImage} /> */}
        <link rel="canonical" href={`https://ai2loop.com${router.asPath}`} />
      </Head>
      <NextNProgress
        color="#38BDF8"
        startPosition={0.1}
        stopDelayMs={400}
        height={2}
        showOnShallow={true}
      />
      <Navbar />
      <main id="skip">{children}</main>
      <Footer />
    </>
  );
}
