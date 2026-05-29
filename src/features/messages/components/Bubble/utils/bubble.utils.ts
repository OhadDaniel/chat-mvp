import {
  BUBBLE_WRAPPER_OWN_CLASS,
  BUBBLE_WRAPPER_OTHER_CLASS,
  BUBBLE_OWN_CLASS,
  BUBBLE_OTHER_CLASS,
  BUBBLE_CONTENT_WRAPPER_OWN_CLASS,
  BUBBLE_CONTENT_WRAPPER_OTHER_CLASS,
  BUBBLE_TIME_OWN_CLASS,
  BUBBLE_TIME_OTHER_CLASS,
} from '../Bubble.constants'

export function buildWrapperClass(isOwn: boolean): string {
  return isOwn ? BUBBLE_WRAPPER_OWN_CLASS : BUBBLE_WRAPPER_OTHER_CLASS
}

export function buildBubbleClass(isOwn: boolean): string {
  return isOwn ? BUBBLE_OWN_CLASS : BUBBLE_OTHER_CLASS
}

export function buildContentWrapperClass(isOwn: boolean): string {
  return isOwn ? BUBBLE_CONTENT_WRAPPER_OWN_CLASS : BUBBLE_CONTENT_WRAPPER_OTHER_CLASS
}

export function buildTimeClass(isOwn: boolean): string {
  return isOwn ? BUBBLE_TIME_OWN_CLASS : BUBBLE_TIME_OTHER_CLASS
}

export function formatMessageTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
