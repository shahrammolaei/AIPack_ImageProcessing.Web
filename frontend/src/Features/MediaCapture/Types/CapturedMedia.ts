export type MediaType =
  | 'image'
  | 'video'
  | 'audio'

export interface CapturedMedia {
  id: string
  type: MediaType
  name: string
  file: File
  source: string
}