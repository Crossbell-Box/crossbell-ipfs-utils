import React from 'react'

import { useHandleLinkClick } from '../hooks'

export type IpfsLinkProps = React.ComponentProps<typeof IpfsLink>

export const IpfsLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ onClick: onClick_, ...props }, ref) => {
  const handleLinkClick = useHandleLinkClick()

  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      onClick_?.(event)

      if (!event.defaultPrevented) {
        handleLinkClick(event)
      }
    },
    [handleLinkClick, onClick_],
  )

  return <a {...props} onClick={onClick} ref={ref} />
})
