import Link from 'next/link'

import { CheckIcon } from '@/components/CheckIcon'
import { Container } from '@/components/Container'

export function Introduction() {
  return (
    <section
      id="introduction"
      aria-label="Introduction"
      className="pb-16 pt-20 sm:pb-20 md:pt-36 lg:py-32"
    >
      <Container className="text-lg tracking-tight text-slate-700">
        <h2 className="font-sans text-4xl font-bold tracking-tight text-slate-900">
          Details about PretzelDAO e.V. Membership
        </h2>
        <p className="mt-4">
          To become an official Member of the PretzelDAO e.V., you first need to be invited to our Community Discord by an existing member. Once inside our Discord Server, you can submit your introduction and wait for the PretzelDAO e.V. Members to upvote. Once upvoted and approved, you can access further channels on our Server and fill out the Application Form for the PretzelDAO e.V. Membership. After your form is approved, your wallet address is added to our mint contract. You can become an official PretzelDAO e.V. member by minting your Membership Card and paying the yearly membership fee during this process.
        </p>
        <p className="mt-4">
          <strong>Membership fee for the year 2023:</strong> 50 USDC
        </p>
        <p className="mt-4">
          Being official PretzelDAO e.V. Member means:
        </p>
        <ul role="list" className="mt-2 space-y-3">
          {[
            'Being able to participate in the on-chain governance of our DAO',
            'Being able to read and upvote intros of new community entrants',
            'Having special Member role/visibility on our Discord',
            'Having access to our exclusive members-only Discord chat channel',
            'Having access to our exclusive members-only merch',
          ].map((feature) => (
            <li key={feature} className="flex">
              <CheckIcon className="h-8 w-8 flex-none fill-blue-500" />
              <span className="ml-1">{feature}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8">
          The PretzelDAO e.V. Membership is valid for each corresponding year for the period from January 1 to December 31.
        </p>
        <p className="mt-10">
          <Link
            href="https://www.pretzeldao.com/"
            className="text-base font-medium text-blue-500 hover:text-blue-600"
          >
            Read our full Club Statute (Vereinssatzung) here (TODO: add link){' '}
            <span aria-hidden="true">⧉</span>
          </Link>
        </p>

        <ol role="list" className="mt-16 space-y-10 sm:space-y-16">
          <li>
            <h2 className="font-sans text-4xl font-bold tracking-tight text-slate-900">
              FAQ
            </h2>
            <ol role="list" className="mt-8 divide-y divide-slate-300/30 rounded-2xl bg-slate-50 px-6 py-3 text-base tracking-tight sm:px-8 sm:py-7">
              <li className="py-3">
                <p className="font-medium text-lg	 text-slate-950">
                  Is my Membership Card NFT transferrable?
                </p>
                <p className="text-slate-500 text-base">
                  No, your Membership Card NFT is soulbound and can't by transferred by you.
                </p>
              </li>
              <li className="py-3">
                <p className="font-medium text-lg	 text-slate-950">
                  Can I refund my Membership Card NFT?
                </p>
                <p className="text-slate-500 text-base">
                  No, your Membership Card NFT is not refundable.
                </p>
              </li>
              <li className="py-3">
                <p className="font-medium text-lg	 text-slate-950">
                  Can I reserve a special number/ID of the Membership Card NFT?
                </p>
                <p className="text-slate-500 text-base">
                  No, but you will have the same Membership number/ID in the following years.
                </p>
              </li>
              <li className="py-3">
                <p className="font-medium text-lg	 text-slate-950">
                  What wallet can I mint with?
                </p>
                <p className="text-slate-500 text-base">
                  Our minting contract is working with <a href="https://metamask.io/" className="underline">MetaMask Wallet</a>.
                </p>
              </li>
              <li className="py-3">
                <p className="font-medium text-lg	 text-slate-950">
                  Which blockchain is used for the mint?
                </p>
                <p className="text-slate-500 text-base">
                  Our minting contract is deployed on the Polygon Network.
                </p>
              </li>
              <li className="py-3">
                <p className="font-medium text-lg	 text-slate-950">
                  What token are needed to mint the Membership Card NFT?
                </p>
                <p className="text-slate-500 text-base">
                  You need $MATIC (for gas fees) and $USDC (for our membership fee) on Polygon Network in order to mint your Membership Card NFT.
                </p>
              </li>
              <li className="py-3">
                <p className="font-medium text-lg	 text-slate-950">
                  Is the minting contract audited?
                </p>
                <p className="text-slate-500 text-base">
                  Our minting contract was audited by <a href="https://neodyme.io/" className="underline">Neodyme AG</a>.
                </p>
              </li>
            </ol>
          </li>
        </ol>
        <p className="mt-4">
          If you have further questions, feel free to ask for assistance in our Discord Server.
        </p>
      </Container>
    </section>
  )
}
