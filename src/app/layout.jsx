import { Poppins } from 'next/font/google';
import './globals.css';

import ProviderShell from './ProviderShell';

import Navigation from './Navigation';

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'I Luv Me',
  description: 'user pannel for I Luv Me',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <ProviderShell>
        <body
          className={`${poppins.className}  bg-tremor-background-muted dark:bg-dark-tremor-background-muted`}
        >
          <Navigation />
          {children}
        </body>
      </ProviderShell>
    </html>
  );
}
