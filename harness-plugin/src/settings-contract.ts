/** Durable Backspace settings shared by the Host schema and Client scope. */

/** Settings namespace owned by the native Backspace plugin. */
export const BACKSPACE_SETTINGS_NAMESPACE = 'ui-backspace'

/** Supported renderer quality policies. */
export const BACKSPACE_QUALITIES = ['auto', 'low', 'high'] as const

/** Renderer quality policy. */
export type BackspaceQuality = typeof BACKSPACE_QUALITIES[number]

/** Durable Backspace preference section. */
export interface BackspaceSettings {
  /** Whether the background and glass token layer are active. */
  enabled: boolean
  /** Gerstner wave strength on a 0-100 scale. */
  sea: number
  /** Daylight position on a 0-100 scale. */
  time: number
  /** Light-mode base surface opacity on a 40-90 percentage scale. */
  glass: number
  /** Whether the renderer advances through its twelve-minute daylight cycle. */
  autoCycle: boolean
  /** Automatic, explicitly low, or explicitly high rendering quality. */
  quality: BackspaceQuality
}

/** Defaults applied when a field is absent from user-settings. */
export const DEFAULT_BACKSPACE_SETTINGS: Readonly<BackspaceSettings> = Object.freeze({
  enabled: true,
  sea: 50,
  time: 55,
  glass: 70,
  autoCycle: true,
  quality: 'auto',
})
