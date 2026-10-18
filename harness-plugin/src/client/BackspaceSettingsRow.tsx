/** General-settings contribution for the native Backspace plugin. */
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import type { ChangeEvent } from 'react'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type { BackspaceQuality } from '../settings-contract.ts'
import type { BackspaceLocaleKey } from './locales.ts'
import type { createBackspaceStore } from './store.ts'
import css from './BackspaceSettingsRow.module.css'

/** Settings writes supplied by the plugin apply closure. */
export interface BackspaceSettingsInjected {
  /** Enable or disable the skin. */
  setEnabled: (value: boolean) => void
  /** Persist the Gerstner wave strength. */
  setSea: (value: number) => void
  /** Persist daylight and pin the cycle at that value. */
  setTime: (value: number) => void
  /** Persist surface opacity. */
  setGlass: (value: number) => void
  /** Enable or disable the automatic daylight cycle. */
  setAutoCycle: (value: boolean) => void
  /** Persist the renderer quality policy. */
  setQuality: (value: BackspaceQuality) => void
}

/** Props derived from the General item slot, shared store and locale seat. */
export type BackspaceSettingsRowProps =
  & PropsRuntime<'settings.general.item'>
  & PropsStore<ReturnType<typeof createBackspaceStore>>
  & PropsLocale<'settings.backspace'>
  & BackspaceSettingsInjected

function number(event: ChangeEvent<HTMLInputElement>): number {
  return Number(event.currentTarget.value)
}

/**
 * Render the Backspace switch, sliders, cycle toggle and quality selector.
 * @param props - composed slot props.
 * @returns the settings row.
 */
export function BackspaceSettingsRow({
  useStore, t, setEnabled, setSea, setTime, setGlass, setAutoCycle, setQuality,
}: BackspaceSettingsRowProps) {
  const state = useStore(snapshot => snapshot)
  const disabled = !state.ready || !state.enabled
  return (
    <section className={css.row} aria-busy={!state.ready}>
      <div className={css.heading}>
        <div>
          <div className={css.title}>{t('title')}</div>
          <div className={css.description}>{t('enabled.description')}</div>
        </div>
        <label>
          <span className={css.description}>{t('enabled')}</span>{' '}
          <input
            className={css.checkbox}
            type="checkbox"
            checked={state.enabled}
            disabled={!state.ready}
            onChange={event => { setEnabled(event.currentTarget.checked) }}
          />
        </label>
      </div>

      <div className={css.controls}>
        <label className={css.control}>
          <span className={css.controlHead}><span>{t('sea')}</span><output className={css.value}>{state.sea}</output></span>
          <input className={css.range} type="range" min="0" max="100" step="1" value={state.sea} disabled={disabled} onChange={event => { setSea(number(event)) }} />
        </label>
        <label className={css.control}>
          <span className={css.controlHead}><span>{t('time')}</span><output className={css.value}>{state.time}</output></span>
          <input className={css.range} type="range" min="0" max="100" step="1" value={state.time} disabled={disabled} onChange={event => { setTime(number(event)) }} />
        </label>
        <label className={css.control}>
          <span className={css.controlHead}><span>{t('glass')}</span><output className={css.value}>{state.glass}%</output></span>
          <input className={css.range} type="range" min="40" max="90" step="1" value={state.glass} disabled={disabled} onChange={event => { setGlass(number(event)) }} />
        </label>
      </div>

      <label className={css.line}>
        <span className={css.title}>{t('autoCycle')}</span>
        <input className={css.checkbox} type="checkbox" checked={state.autoCycle} disabled={disabled} onChange={event => { setAutoCycle(event.currentTarget.checked) }} />
      </label>

      <label className={css.line}>
        <span className={css.title}>{t('quality')}</span>
        <select className={css.select} value={state.quality} disabled={disabled} onChange={event => { setQuality(event.currentTarget.value as BackspaceQuality) }}>
          {(['auto', 'low', 'high'] as const).map(value => (
            <option key={value} value={value}>{t(`quality.${value}` as BackspaceLocaleKey)}</option>
          ))}
        </select>
      </label>
      <p className={css.note}>{t('reducedMotion')}</p>
    </section>
  )
}
