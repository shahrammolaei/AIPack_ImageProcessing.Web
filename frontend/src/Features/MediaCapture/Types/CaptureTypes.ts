export type CaptureMode =
  | 'image'
  | 'video'
  | 'audio'
  | 'screen'

export type CaptureSource =
  | 'camera'
  | 'microphone'
  | 'screen'

export interface CaptureOptions {
  mode: CaptureMode
  source: CaptureSource
  includeAudio?: boolean
}