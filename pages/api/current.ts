import { NextApiRequest, NextApiResponse } from "next"

let texts = ["Welcome to ETSAP!"]

function saveText(text: string) {
  texts.unshift(text)
  if (texts.length > 10) {
    texts.pop()
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET": {
      res.status(200).json({
        texts,
      })
      break
    }
    case "POST": {
      if (req.body.text) {
        if (req.body.text.length > 1e5) {
          res.status(400).send("unvalid text")
        } else {
          saveText(req.body.text)
          res.status(200).json({
            texts,
          })
        }
      } else {
        res.status(400).send("unvalid text")
      }
    }
    default: {
      res.status(405)
    }
  }
}
