/** Host-side validation for the native Backspace preference section. */
import z from '@deepseek-ai/schemastery'
import {
  DEFAULT_BACKSPACE_SETTINGS, BACKSPACE_QUALITIES, type BackspaceSettings,
} from './settings-contract.ts'

/** Durable Backspace schema and wire validation. */
export const BackspaceSettingsSchema: z<BackspaceSettings> = z.object({
  enabled: z.boolean().default(DEFAULT_BACKSPACE_SETTINGS.enabled),
  sea: z.natural().max(100).default(DEFAULT_BACKSPACE_SETTINGS.sea),
  time: z.natural().max(100).default(DEFAULT_BACKSPACE_SETTINGS.time),
  glass: z.natural().min(40).max(90).default(DEFAULT_BACKSPACE_SETTINGS.glass),
  autoCycle: z.boolean().default(DEFAULT_BACKSPACE_SETTINGS.autoCycle),
  quality: z.union([...BACKSPACE_QUALITIES]).default(DEFAULT_BACKSPACE_SETTINGS.quality),
})
