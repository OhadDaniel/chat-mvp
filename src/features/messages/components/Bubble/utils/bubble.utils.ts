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

export function buildWrapperClass(isFromCurrentUser: boolean): string {
  return isFromCurrentUser ? BUBBLE_WRAPPER_OWN_CLASS : BUBBLE_WRAPPER_OTHER_CLASS
}

export function buildBubbleClass(isFromCurrentUser: boolean): string {
  return isFromCurrentUser ? BUBBLE_OWN_CLASS : BUBBLE_OTHER_CLASS
}

export function buildContentWrapperClass(isFromCurrentUser: boolean): string {
  return isFromCurrentUser ? BUBBLE_CONTENT_WRAPPER_OWN_CLASS : BUBBLE_CONTENT_WRAPPER_OTHER_CLASS
}

export function buildTimeClass(isFromCurrentUser: boolean): string {
  return isFromCurrentUser ? BUBBLE_TIME_OWN_CLASS : BUBBLE_TIME_OTHER_CLASS
}

export function formatMessageTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
