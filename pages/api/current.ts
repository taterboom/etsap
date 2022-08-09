import { NextApiRequest, NextApiResponse } from "next"

let text = "Welcome to ETSAP!"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET": {
      res.status(200).json({
        text,
      })
      break
    }
    case "POST": {
      if (req.body.text) {
        text = req.body.text
        res.status(200).json({
          text,
        })
      } else {
        res.status(400).send("unvalid text")
      }
    }
    default: {
      res.status(405)
    }
  }
}
