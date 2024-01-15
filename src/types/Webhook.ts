export interface OmnivorePage {
  type: 'page'
  userId: string
  id: string
  description: string
  title: string
  slug: string
  state: string
}

export interface PageWebhookInput {
  action: string
  userId: string
  page: OmnivorePage
}
