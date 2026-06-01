"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

interface ScrollTextProps {
  phrase: string
  className?: string
  style?: React.CSSProperties
}

export default function ScrollText({ phrase, className = "", style }: ScrollTextProps) {
  const refs = useRef<(HTMLSpanElement | null)[]>([])
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    refs.current = refs.current.filter(Boolean)

    gsap.to(refs.current, {
      scrollTrigger: {
        trigger: container.current,
        scrub: true,
        start: "top 85%",
        end: `+=${window.innerHeight * 0.9}`,
      },
      opacity: 1,
      ease: "none",
      stagger: 0.04,
    })

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [])

  const splitWords = (text: string) =>
    text.split(" ").map((word, i) => (
      <span key={i} className="inline-flex mr-[0.3em] mb-[0.1em]">
        {word.split("").map((letter, j) => (
          <span
            key={j}
            ref={(el) => { refs.current.push(el) }}
            style={{ opacity: 0.07 }}
          >
            {letter}
          </span>
        ))}
      </span>
    ))

  return (
    <div ref={container} className={className} style={style}>
      <div className="flex flex-wrap leading-tight">
        {splitWords(phrase)}
      </div>
    </div>
  )
}
