// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import Pusher from "pusher"

type Data = {
	message: string
	username: string
}

const pusher = new Pusher({
	appId: "",
	key: "",
	secret: "",
	cluster: "eu",
	useTLS: true,
})
export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		const { message, username } = JSON.parse(req.body) as Data
		pusher.trigger("my-channel", "my-event", {
			message,
			username,
		})
	}
	res.status(200).json({})
}
