import type { ReactNode } from 'react'

export type AuthCardProps = {
  title: string
  subtitle: string
  className: string
  titleClassName: string
  subtitleClassName: string
  bodyClassName: string
  children: ReactNode
}

/** Card shell: title, subtitle, and a body slot. Every visual value is a prop. */
export function AuthCard({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
  bodyClassName,
  children,
}: AuthCardProps) {
  return (
    <div className={className}>
      <h1 className={titleClassName}>{title}</h1>
      <p className={subtitleClassName}>{subtitle}</p>
      <div className={bodyClassName}>{children}</div>
    </div>
  )
}
