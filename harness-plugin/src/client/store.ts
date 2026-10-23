/** Shared root-scoped viewing state for the background and its settings row. */
import { defineStore, type EngineStoreHandle } from '@deepseek-ai/dsh-client-store'
import type { BackspaceSettings } from '../settings-contract.ts'

/** Reactive state mirrored from the durable settings scope. */
export interface BackspaceState extends BackspaceSettings {
  /** Whether the first settings snapshot has landed. */
  ready: boolean
  /** Monotonic adoption counter used to reject stale writes. */
  revision: number
}

type BackspaceActions = {
  sync: (draft: BackspaceState, settings: BackspaceSettings, revision: number) => void
}

/**
 * Declare the state shared by the two root-scope slot registrations.
 * @returns a Harness store handle.
 */
export function createBackspaceStore(): EngineStoreHandle<BackspaceState, BackspaceActions> {
  return defineStore({
    init: (): BackspaceState => ({
      ready: false,
      revision: -1,
      enabled: true,
      sea: 50,
      time: 55,
      glass: 70,
      autoCycle: true,
      quality: 'auto',
    }),
    actions: {
      sync: (draft, settings: BackspaceSettings, revision: number) => {
        if (revision <= draft.revision) return
        Object.assign(draft, settings, { ready: true, revision })
      },
    },
  })
}
