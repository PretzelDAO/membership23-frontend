"use client"
import { useEffect, useState } from "react"
import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractEvent } from "wagmi"
import { usdcMockSolABI, erc721MembershipMintSolABI } from "@/constants/generated"
import { readContract } from "@wagmi/core"
import ConnectWallet from "./ConnectWallet";
import NotificationPopup from "./NotificationPopup"
import TransactionModal from "./TransactionModal"


export default function MintModule() {
    type PrefixedHexString = `0x${string}`;
    const { address, isConnected } = useAccount()
    const [enoughAllowance, setEnoughAllowance] = useState(false);
    const [isClient, setIsCLient] = useState(false);
    const [isBalanceOk, setIsBalanceOk] = useState(true);
    const [isAllowlisted, setIsAllowlisted] = useState(true);
    const [mintSuccess, setMintSuccess] = useState(false);
    const [mintSuccessNotifyIsOpen, setMintSuccessNotifyIsOpen] = useState(false);
    const [allowanceSuccessNotifyIsOpen, setAllowanceSuccessNotifyIsOpen] = useState(false);
    const [errorNotifyIsOpen, setErrorNotifyIsOpen] = useState(false);
    const [mintModalIsOpen, setMintModalIsOpen] = useState(false);
    const [allowanceModalIsOpen, setAllowanceModalIsOpen] = useState(false);
    const [mintedNftId, setMintedNftId] = useState(0);

    useEffect(() => {
        setIsCLient(true)
    }, [])

    useEffect(() => {
        if (isConnected) {
            checkAllowance()
            checkAllowlist()
            checkBalance()
        } else {
            setEnoughAllowance(false)
        }
    }, [isConnected])

    const paymentTokenContractAddress: PrefixedHexString = process.env.NEXT_PUBLIC_PAYMENT_TOKEN_CONTRACT_ADDRESS
        ? process.env.NEXT_PUBLIC_PAYMENT_TOKEN_CONTRACT_ADDRESS as PrefixedHexString
        : "0x0";

    const mintContractAddress: PrefixedHexString = process.env.NEXT_PUBLIC_MEMBERSHIP_CONTRACT_ADDRESS
        ? process.env.NEXT_PUBLIC_MEMBERSHIP_CONTRACT_ADDRESS as PrefixedHexString
        : "0x0";

    const connectedWallet: PrefixedHexString = address ? address as PrefixedHexString : "0x0";

    const mintPrice: bigint = process.env.NEXT_PUBLIC_MINT_PRICE ? BigInt(process.env.NEXT_PUBLIC_MINT_PRICE) : BigInt(0)
    const openSeaBaseUrl = process.env.NEXT_PUBLIC_OPEN_SEA_BASE_URL




    //Methods reading from smart contracts that are required to determine in which state of the mint the user currently is and what needs to be done

    async function checkAllowance() {
        if (!isConnected) return BigInt(0)

        const allowance = await readContract({
            abi: usdcMockSolABI,
            address: paymentTokenContractAddress,
            functionName: 'allowance',
            args: [connectedWallet, mintContractAddress]
        })

        const enoughAllowance = allowance >= mintPrice
        setEnoughAllowance(enoughAllowance)
        return (enoughAllowance)
    }

    async function checkAllowlist() {
        const data = await readContract({
            abi: erc721MembershipMintSolABI,
            address: mintContractAddress,
            functionName: 'allowlistWithId',
            args: [connectedWallet]
        })
        const isAllowlisted = data > BigInt(0)
        setIsAllowlisted(isAllowlisted)
        return isAllowlisted
    }

    async function checkBalance() {
        if (!isConnected) return true
        const data = await readContract({
            abi: erc721MembershipMintSolABI,
            address: mintContractAddress,
            functionName: 'balanceOf',
            args: [connectedWallet]
        })
        const isBalanceOk = data == BigInt(0)
        setIsBalanceOk(isBalanceOk)
        return isBalanceOk
    }


    //Set up the transaction to give the required allowance for the mint

    const { config: allowanceConfig } = usePrepareContractWrite({
        address: paymentTokenContractAddress,
        abi: usdcMockSolABI,
        functionName: 'approve',
        args: [mintContractAddress, mintPrice]
    })
    const { write: allowanceWrite, data: allowanceData, error: allowanceWriteError, isError: allowanceWriteIsError } = useContractWrite(allowanceConfig)

    const { isSuccess: allowanceIsSucces, isError: allowanceIsError, isLoading: allowanceIsLoading, error: allowanceError } = useWaitForTransaction({
        hash: allowanceData?.hash,

    })


    //Set up the mint transaction

    const { config: mintConfig, refetch: mintPrepareRefetch } = usePrepareContractWrite({
        address: mintContractAddress,
        abi: erc721MembershipMintSolABI,
        functionName: 'mint',
        enabled: false, //since the balance might not be set, this fails most likely on first try
    })
    const { write: mintWrite, data: mintData, reset: mintReset, isError: mintWriteIsError, error: mintWriteError } = useContractWrite(mintConfig)

    const { isSuccess: mintIsSuccess, isError: mintIsError, error: mintError, isLoading: mintIsLoading } = useWaitForTransaction({
        hash: mintData?.hash,

    })

    const unwatch = useContractEvent({
        address: mintContractAddress,
        abi: erc721MembershipMintSolABI,
        eventName: 'Transfer',
        listener: (event) => {
            if (event[0].topics[2].toLowerCase().includes(address ? address.toLowerCase().substring(2) : "address not set")) {
                setMintedNftId(parseInt(event[0].topics[3], 16))
                unwatch?.()
            }

        }
    })


    //functions called by the buttons

    async function setAllowance() {
        await checkAllowance()
        if (!enoughAllowance) {
            allowanceWrite?.()
        }

    }

    async function mint() {
        setAllowanceSuccessNotifyIsOpen(false) //close the notification that the allowance was successful so the mint notification will be visible
        await checkAllowance()
        await checkAllowlist()
        await checkBalance()
        if (isAllowlisted && isBalanceOk && enoughAllowance) {

            mintWrite?.()
        }

    }



    //Reacting to the change of state variables
    useEffect(() => {
        if (enoughAllowance) {
            //you can do the mint prepare only once the allowance is set  - otherwise it will fail
            //if the allowance is already set on loading you would not populate the fetch when doing this
            //call only in the allowanceIsSuccess check
            mintPrepareRefetch()
        }
    }, [enoughAllowance])



    //Handle successful transcation

    useEffect(() => {
        if (allowanceIsSucces) {
            checkAllowance() //update the enoughAllowance state variable to take the successful transaction into account
            setAllowanceSuccessNotifyIsOpen(true) //show the user a notification that the allowance was successful

        }
    }, [allowanceIsSucces])


    useEffect(() => {
        if (mintIsSuccess) {
            setMintSuccess(true) //setting state to give a different message to the user than when visiting the page with already minted membership card
            setMintSuccessNotifyIsOpen(true) //show the user a notification that the mint was successful
            checkBalance() //update the isBalanceOk state variable to take the successful transaction into account

        }
    }, [mintIsSuccess])




    //Handle errors in various stages

    useEffect(() => {
        if (allowanceIsError) {
            //handle here what needs to be done if the allowance transaction fails
            setErrorNotifyIsOpen(true)
        }
    }, [allowanceIsError])


    useEffect(() => {
        if (allowanceWriteIsError) {
            //handle here what needs to be done if the allowance transaction fails
            setErrorNotifyIsOpen(true)
        }
    }, [allowanceWriteIsError])

    useEffect(() => {
        if (mintIsError) {
            //handle here what needs to be done if the mint transaction fails
            setErrorNotifyIsOpen(true)
        }
    }, [mintIsError])

    useEffect(() => {
        if (mintWriteError) {
            //handle here what needs to be done if the user e.g. decides to reject the transaction
            setErrorNotifyIsOpen(true)
        }
    }, [mintWriteError])


    //Handle loading effects

    useEffect(() => {
        if (allowanceIsLoading) {
            setAllowanceModalIsOpen(true)

        }
        if (!allowanceIsLoading) {
            setAllowanceModalIsOpen(false)
        }
    }, [allowanceIsLoading])

    useEffect(() => {
        if (mintIsLoading) {
            setMintModalIsOpen(true)
        }
        if (!mintIsLoading) {
            setMintModalIsOpen(false)
        }
    }, [mintIsLoading])

    return (
        <>
            <div className="mt-8 flex gap-4">
            {isClient && !isConnected && <ConnectWallet />}

            {isClient && isBalanceOk && isConnected && isAllowlisted && !enoughAllowance && <button onClick={setAllowance} disabled={!allowanceWrite} className="inline-flex justify-center rounded-md py-1 px-4 text-base font-semibold tracking-tight shadow-sm bg-gradient-to-r from-blue-500 to-emerald-300 hover:from-emerald-300 hover:to-emerald-300 transition ease-in-out delay-50 hover:scale-105 duration-100">
                Set allowance of 20 USDC
            </button>}

            {isClient && isBalanceOk && isConnected && isAllowlisted && enoughAllowance && <button onClick={mint} disabled={!mintWrite} className="inline-flex justify-center rounded-md py-1 px-4 text-base font-semibold tracking-tight shadow-sm bg-gradient-to-r from-blue-500 to-emerald-300 hover:from-emerald-300 hover:to-emerald-300 transition ease-in-out delay-50 hover:scale-105 duration-100">
                Mint
            </button>}
            <a href="#introduction" className="inline-flex justify-center rounded-md border py-[calc(theme(spacing.1)-1px)] px-[calc(theme(spacing.4)-1px)] text-base font-semibold tracking-tight focus:outline-none border-slate-500 text-slate-400 hover:text-slate-800 hover:border-slate-500 hover:bg-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 active:border-slate-200 active:bg-slate-50 active:text-slate-900/70 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-transparent transition ease-in-out delay-50 hover:scale-105 duration-100">
                Read more
            </a>
            </div>
            {isClient && isConnected && isAllowlisted && !enoughAllowance && isBalanceOk && <p className="mt-4 text-base text-slate-200">You need to set an allowance of 20 USDC (type in "20" or hit "use default" in the MetaMask modal) for minting contract of the Membership Card NFT using the button above.</p>}
            {isClient && isConnected && isAllowlisted && isBalanceOk && enoughAllowance && <><p className="mt-4 text-base text-green-400">You successfully added the required allowance!</p><p className="mt-4 text-base text-slate-200">When you click “mint”, 20 USDC will be transferred to the DAO treasury and you receive your PretzelDAO Membership Card NFT.</p></>}
            {isClient && isConnected && !isBalanceOk && !mintSuccess && <p className="mt-4 text-base text-slate-200">You already own a PretzelDAO e.V. Membership Card NFT, only 1 NFT per member is possible.</p>}
            {isClient && isConnected && !isBalanceOk && mintSuccess && <><p className="mt-4 text-base text-green-400">Success! Congrats on minting your PretzelDAO e.V. Membership Card NFT!</p></>}
            {isClient && isConnected && !isBalanceOk && mintSuccess && mintedNftId > 0 && <a className="text-gray-400 underline" href={openSeaBaseUrl + mintContractAddress + "/" + mintedNftId} target="_blank">View your Membership Card NFT on OpenSea ⧉</a>}
            {isClient && isConnected && !isAllowlisted && <p className="mt-4 text-base text-red-600">You need to be allowlisted to be able to mint. Ask in Discord for assistance.</p>}
            

            <NotificationPopup success={true} isActive={mintSuccessNotifyIsOpen} setActive={setMintSuccessNotifyIsOpen} title="Minting Successful" description="You have successfully minted your PretzelDAO Membership Card!" />
            <NotificationPopup success={true} isActive={allowanceSuccessNotifyIsOpen} setActive={setAllowanceSuccessNotifyIsOpen} title="Allowance Successful" description="You have successfully given the mint contract an allowance of 20 USDC." />
            <NotificationPopup success={false} isActive={errorNotifyIsOpen} setActive={setErrorNotifyIsOpen} title="Error" description="An error occured. Please try again." />
            <TransactionModal open={mintModalIsOpen} setOpen={setMintModalIsOpen} title="Minting Membership Card NFT" description="You are currently minting your PretzelDAO Membership Card…" txHash={mintData?.hash} />
            <TransactionModal open={allowanceModalIsOpen} setOpen={setAllowanceModalIsOpen} title="Processing Allowance" description="Transcation for giving the mint contract an allowance of 20 USDC is processing…" txHash={allowanceData?.hash} />

        </>


    )
}