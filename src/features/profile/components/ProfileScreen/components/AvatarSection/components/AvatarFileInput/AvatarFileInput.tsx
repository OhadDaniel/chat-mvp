import type { ChangeEvent, RefObject } from 'react'
import { AVATAR_FILE_ACCEPT, AVATAR_FILE_INPUT_CLASS } from './AvatarFileInput.constants'

type Props = {
  inputRef: RefObject<HTMLInputElement | null>
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export function AvatarFileInput({ inputRef, onChange }: Props) {
  return (
    <input
      ref={inputRef}
      type="file"
      accept={AVATAR_FILE_ACCEPT}
      onChange={onChange}
      className={AVATAR_FILE_INPUT_CLASS}
    />
  )
}
