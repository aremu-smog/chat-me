import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Geist, Geist_Mono } from "next/font/google"
import Head from "next/head"
import Pusher from "pusher-js"
import { ChangeEvent, Fragment, useEffect, useRef, useState } from "react"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

interface Data {
	message: string
	username: string
}
export default function Home() {
	const pusher = new Pusher("", {
		cluster: "eu",
	})

	const [username, setUsername] = useState("")
	const [messages, setMessages] = useState<Data[]>([])

	const [message, setMessage] = useState("")
	const [canParticipate, setCanPartcipate] = useState(false)

	const wrapperRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const connectToChannels = async () => {
			const channel = pusher.subscribe("my-channel")
			channel.bind("pusher:subscription_succeeded", () => {
				alert("You are now online!")
			})
			channel.bind("my-event", function (data: Data) {
				setMessages(prev => [...prev, data])
				if (wrapperRef.current !== null) {
					wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight
				}
			})
			return () => channel.unsubscribe()
		}

		connectToChannels()
	}, [])

	return (
		<div
			className={`${geistSans.variable} ${geistMono.variable} bg-black h-screen w-full p-5 `}>
			<Head>
				<title>{canParticipate ? `Chat Me - ${username}` : "Chat Me"}</title>
			</Head>
			<main className=''>
				<h1 className='font-medium text-3xl'>
					Chat me {canParticipate && `(${username})`}
				</h1>

				{!canParticipate && (
					<div className='mt-4'>
						<Input
							placeholder='Username'
							className='mb-2'
							onChange={e => {
								setUsername(e.target.value)
							}}
							value={username}
						/>

						<Button
							onClick={() => {
								setCanPartcipate(true)
							}}>
							Login
						</Button>
					</div>
				)}

				{canParticipate && (
					<Fragment>
						<div
							ref={wrapperRef}
							className='max-h-[50vh] overflow-y-scroll mt-4 mb-2 flex flex-col'>
							{messages.map((message, index) => {
								const isMe = message.username === username
								return (
									<div
										key={index}
										className={`rounded-lg border border-zinc-600 p-2 w-auto mb-3 max-w-screen-lg last:mb-20 ${
											isMe ? "ml-auto" : "mr-auto"
										} `}>
										<p className=' text-zinc-500 uppercase text-xs tracking-wider '>
											{message.username}
										</p>
										<p>{message.message}</p>
									</div>
								)
							})}
						</div>
						<textarea
							value={message}
							onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
								setMessage(e.currentTarget.value)
							}}
							className='bg-zinc-900 p-4 rounded-lg text-zinc-50 shadow hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 w-full'
						/>
						<Button
							onClick={() => {
								if (message) {
									fetch("/api/chat", {
										method: "POST",
										body: JSON.stringify({
											message,
											username,
										}),
									})
										.then(res => res.json())
										.then(() => {
											setMessage("")
										})
								}
							}}>
							Send Message
						</Button>
					</Fragment>
				)}
			</main>
		</div>
	)
}
