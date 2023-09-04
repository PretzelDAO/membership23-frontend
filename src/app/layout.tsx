import { Open_Sans } from 'next/font/google'
import clsx from 'clsx'
import "@rainbow-me/rainbowkit/styles.css";

import '@/styles/tailwind.css'
import Wagmi from './config/wagmiConfig'

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-opensans',
})

export const metadata = {
  title: 'PretzelDAO - Membership Card Mint',
  description:
    'Frontend interface to mint your PretzelDAO e.V. Membership Card NFT',
}

export default function RootLayout({ children } : { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={clsx(
        'h-full scroll-smooth bg-white antialiased',
        openSans.variable,
      )}
    >
      <head>
      </head>
      
        <body className="flex min-h-full flex-col">
        <Wagmi>
          {children}
        </Wagmi>
        </body>
      
      
    </html>
  )
}
