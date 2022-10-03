import type { NextPage } from "next"
import Head from "next/head"
import { SVGProps, useEffect, useRef, useState } from "react"
import styles from "../styles/Home.module.css"
import useSWR from "swr"

const MAX_LENGTH = 1024 * 128

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json())

const App = () => {
  const [toastMessage, setToastMessage] = useState("")
  const { data, error, mutate } = useSWR("/api/current", fetcher)
  const onPaste = useRef((text: string) => {
    if (text.length > MAX_LENGTH) {
      alert("max length: " + MAX_LENGTH)
      return
    }
    fetcher("/api/current", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
      }),
    })
      .then(mutate)
      .then(() => {
        setToastMessage("Success!")
      })
      .catch((err) => {
        setToastMessage("Fail: " + err.message)
      })
  })
  const onCopy = () => {
    window.navigator.clipboard.writeText(data.text).then(() => {
      setToastMessage("Copied!")
    })
  }
  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData("text")
      if (!text) return
      onPaste.current(text)
    }
    document.documentElement.addEventListener("paste", handler)
    return () => {
      document.documentElement.removeEventListener("paste", handler)
    }
  }, [])
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage("")
      }, 2500)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [toastMessage])
  if (error) return <div>{error.message}</div>
  if (!data) return <div>Loading...</div>
  return (
    <>
      <button
        className={styles.action}
        onClick={() => {
          window.navigator.clipboard.readText().then(onPaste.current)
        }}
      >
        paste
      </button>
      <code onClick={() => onCopy()}>{data.text}</code>
      <button className={styles.action} onClick={() => onCopy()}>
        copy
      </button>
      <div className={`toast ${toastMessage ? "active" : ""}`}>{toastMessage}</div>
    </>
  )
}

function IconMdiGithub(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"
      ></path>
    </svg>
  )
}

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>ETSAP</title>
        <meta name="description" content="copy and paste on cloud" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <App />
      </main>

      <footer className={styles.footer}>
        <a href="https://www.github.com/taterboom" target="_blank" rel="noreferrer">
          <IconMdiGithub />
        </a>
      </footer>
    </div>
  )
}

export default Home
