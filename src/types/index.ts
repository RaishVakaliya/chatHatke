export interface User {
  id: string
  name: string
  avatar: string
  online: boolean
  initials?: string
}

export interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
  isOwn: boolean
}

export interface Chat {
  id: string
  user: User
  lastMessage: string
  timestamp: string
  unreadCount: number
  messages: Message[]
}
