import React from 'react'
import { useIsomorphicLayoutEffect } from 'react-use'

import { useHandleLinkClick } from '@crossbell/ipfs-react'

export type ResourceCardProps = {
  cid: string
  src: string
  alt?: string
}

export function ImgCard({ cid, src, alt }: ResourceCardProps) {
  const startTime = React.useMemo(() => Date.now(), [])
  const trimmedCID = React.useMemo(() => cid.replace(/^(\w{2})\w+(\w{2})$/, '$1...$2'), [cid])
  const handleLinkClick = useHandleLinkClick()

  const [duration, setDuration] = React.useState(0)

  const imgRef = React.useRef<HTMLImageElement>(null)

  useIsomorphicLayoutEffect(() => {
    if (imgRef.current?.complete) {
      setDuration(Date.now() - startTime)
    }
  }, [imgRef, startTime])

  return (
    <div className="flex flex-col">
      <div className="bg-slate-200 rounded-md mb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          className="w-full aspect-square object-contain"
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setDuration(Date.now() - startTime)}
        />
      </div>
      <p className="m-0 font-mono text-sm flex items-center">
        {duration ? (
          `${duration}ms`
        ) : (
          <svg
            className="animate-spin mr-1 h-4 w-4 text-teal-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
      </p>
      <a
        href={src}
        target="_blank"
        onClick={handleLinkClick}
        className="hover:underline"
        rel="noreferrer"
      >
        <p className="m-0 break-all font-mono text-xs opacity-60">{src.replace(cid, trimmedCID)}</p>
      </a>
    </div>
  )
}
