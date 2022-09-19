import React from 'react'

import { useHandleLinkClick } from '../hooks'

export type IpfsLinkProps = React.ComponentProps<typeof IpfsLink>

export const IpfsLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>((props, ref) => {
  const handleClick = useHandleLinkClick(props.onClick)

  return <a {...props} onClick={handleClick} ref={ref} />
})
