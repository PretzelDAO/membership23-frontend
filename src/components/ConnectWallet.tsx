"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import classNames from "classnames";

function ConnectWallet() {
    return (
        <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
                return (
                    <div className={classNames({ hidden: !mounted })}>
                        {(() => {
                            if (!mounted || !account || !chain) {
                                return (
                                    <div className="inline-flex justify-center rounded-md py-1 px-4 text-base font-semibold tracking-tight shadow-sm bg-gradient-to-r from-blue-500 to-emerald-300 hover:from-emerald-300 hover:to-emerald-300 transition:ease-in-out delay-50 hover:scale-105 duration-100 cursor-pointer" onClick={openConnectModal}>Connect Wallet</div>
                                );
                            }

                            return (

                                <div className="inline-flex justify-center rounded-md py-1 px-4 text-base font-semibold tracking-tight shadow-sm bg-gradient-to-r from-blue-500 to-emerald-300 hover:from-emerald-300 hover:to-emerald-300 transition:ease-in-out delay-50 hover:scale-105 duration-100 cursor-pointer" onClick={openAccountModal}>
                                    {account.displayName}
                                </div>

                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    )
}

export default ConnectWallet