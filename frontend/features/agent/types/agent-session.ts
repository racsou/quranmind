import { AgentChatMessage } from './agent-message'

export interface AgentSession {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  modelUsed: string
  messages: AgentChatMessage[]
}
