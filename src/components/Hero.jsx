import Image from 'next/image'

import { GridPattern } from '@/components/GridPattern'
import coverImage from '@/images/pretzeldao-membershipcard-2023.png'

function Testimonial() {
  return (
    <figure className="relative mx-auto max-w-md text-center lg:mx-0 lg:text-left">
      <blockquote className="mt-2">
        <p className="font-sans text-xl font-medium text-slate-900">
          “We are a community of builders, baked in Munich, at home in web3.”
        </p>
      </blockquote>
      <figcaption className="mt-2 text-sm text-slate-500">
        <strong className="font-semibold text-teal-400 before:content-['—_']">
          Founding Members
        </strong>
        , pre PretzelDAO (W3B) Manifesto, 2021
      </figcaption>
    </figure>
  )
}

export function Hero() {
  return (
    <header className="overflow-hidden bg-slate-200 lg:bg-slate-800 lg:px-5">
      <div className="mx-auto grid max-w-6xl grid-cols-1 grid-rows-[auto_1fr] gap-y-16 pt-16 md:pt-20 lg:grid-cols-12 lg:gap-y-20 lg:px-3 lg:pb-36 lg:pt-20 xl:py-32">
        <div className="relative flex items-end lg:col-span-5 lg:row-span-2">
          <div className="absolute -bottom-12 -top-20 left-0 right-1/2 z-10 rounded-br-6xl bg-gradient-to-r from-rose-500 via-blue-500 to-emerald-300 text-white/10 md:bottom-8 lg:-inset-y-32 lg:left-[-100vw] lg:right-full lg:-mr-40">
            <GridPattern
              x="100%"
              y="100%"
              patternTransform="translate(112 64)"
            />
          </div>
          <div className="relative z-10 mx-auto flex w-64 rounded-xl bg-slate-600 shadow-xl md:w-80 lg:w-auto">
            <Image className="w-full rounded-lg" src={coverImage} alt="" priority />
          </div>
        </div>
        <div className="relative px-4 sm:px-6 lg:col-span-7 lg:pb-14 lg:pl-16 lg:pr-0 xl:pl-20">
          <div className="hidden lg:absolute lg:-top-32 lg:bottom-0 lg:left-[-100vw] lg:right-[-100vw] lg:block bg-slate-100" />
          <Testimonial />
        </div>
        <div className="bg-slate-800 pt-16 pb-16 lg:col-span-7 lg:pl-16 lg:pt-0 lg:pb-0 xl:pl-20">
          <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
            <h1 className="font-sans text-4xl font-semibold text-slate-100 sm:text-6xl">
              Mint your PretzelDAO Membership Card
            </h1>
            <p className="mt-4 text-2xl text-slate-200">
              Connect your eligible wallet on Polygon network to mint your official PretzelDAO e.V. Memership Card NFT.
            </p>
            <div className="mt-8 flex gap-4">
              <button type="button" id="mainButton" className="inline-flex justify-center rounded-md py-1 px-4 text-base font-semibold tracking-tight shadow-sm bg-gradient-to-r from-blue-500 to-emerald-300 hover:from-emerald-300 hover:to-emerald-300 transition ease-in-out delay-50 hover:scale-105 duration-100">
                Connect Wallet
              </button>
              <a href="#introduction" className="inline-flex justify-center rounded-md border py-[calc(theme(spacing.1)-1px)] px-[calc(theme(spacing.4)-1px)] text-base font-semibold tracking-tight focus:outline-none border-slate-500 text-slate-400 hover:text-slate-800 hover:border-slate-500 hover:bg-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 active:border-slate-200 active:bg-slate-50 active:text-slate-900/70 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-transparent transition ease-in-out delay-50 hover:scale-105 duration-100">
                Read more
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
