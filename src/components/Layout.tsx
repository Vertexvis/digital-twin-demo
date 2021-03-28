import Head from 'next/head';
import React, { ReactNode } from 'react';

export interface Props {
  readonly title: string;
  readonly children: ReactNode;
}

export function Layout({ title, children }: Props): JSX.Element {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon-512x512.png" />
      </Head>
      <main className="h-screen w-screen">
        <div className="h-full w-full grid grid-cols-sidebar-16 grid-rows-header-6">
          {children}
        </div>
      </main>
    </>
  );
}
