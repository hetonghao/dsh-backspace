// GENERATED from shared/skin-core.js. Run npm run build after editing shared sources.
window.__ModuleLoader__.load({ id: "dsh-backspace", factory: (require) => {
  var module = { exports: {} };
  var exports = module.exports;
// Backspace shared host-page controller.
//
// This file intentionally has no import/export statements: the release build
// concatenates it with either the Chrome storage adapter or the localStorage
// adapter, so both installation paths run the same DOM, glass and a11y code.
(function registerBackspaceSkinCore(global) {
  'use strict';

  const IDS = Object.freeze({
    frame: '__dsh-backspace__',
    glass: '__dsh-backspace-glass__',
    uiStyle: '__dsh-backspace-glass__-ui',
    button: '__dsh-backspace-btn__',
    panel: '__dsh-backspace-panel__',
  });

  const DEFAULTS = Object.freeze({
    enabled: true,
    sea: 50,
    time: 55,
    glass: 70,
    autoCycle: true,
    chatCustom: true,
    chatOpacity: 90,
  });

  // The conversation column shares the workspace glass until the independent
  // control is switched on; at 100% it is indistinguishable from unthemed
  // Harness. Keep these bounds in one place: the slider, normalize() and the
  // generated CSS must agree on them.
  const CHAT_OPACITY_MIN = 40;
  const CHAT_OPACITY_MAX = 100;

  // Layers that float above the workspace must stay readable, so the glass
  // alpha never applies to them. Harness paints hover previews with
  // --dsw-alias-bg-layer-1 and dialogs / floating dock windows with layer-2;
  // both are opaque in its own palette. Overriding them with the workspace
  // alpha let the page behind bleed through the preview card's diff text.
  // Keep this the same value the settings dialog already uses.
  const ELEVATED_ALPHA = 0.97;

  const COPY = Object.freeze({
    zh: {
      button: 'Backspace 皮肤设置',
      close: '关闭',
      sea: '波浪大小',
      time: '日光',
      glass: '玻璃不透明度',
      enable: '启用 Backspace 皮肤',
      autoCycle: '自动昼夜循环',
      chatCustom: '对话面板独立背景调整',
      chatOpacity: '对话面板不透明度',
      reset: '恢复默认',
      resetNote: '恢复全部默认设置（波浪 50 / 日光 55 / 玻璃 70 / 自动循环开 / 对话面板独立背景开、不透明度 90）',
      note: '调节即时生效并自动保存；手动设定「日光」后会停止自动昼夜循环。开启「对话面板独立背景调整」后，可以用下面的拖动条单独设定中间对话区的背景浓度，100% 即 Harness 原生背景；关闭时对话区跟随上面的「玻璃不透明度」，左右侧栏始终使用主玻璃。',
      times: ['黄昏', '金色时刻', '下午', '正午'],
    },
    en: {
      button: 'Backspace skin settings',
      close: 'Close',
      sea: 'Sea state',
      time: 'Daylight',
      glass: 'Glass opacity',
      enable: 'Enable Backspace skin',
      autoCycle: 'Automatic day cycle',
      chatCustom: 'Independent conversation background',
      chatOpacity: 'Conversation opacity',
      reset: 'Reset to defaults',
      resetNote: 'Restore all defaults (sea 50 / daylight 55 / glass 70 / auto cycle on / independent conversation background on at 90%)',
      note: 'Changes apply immediately and save automatically. Setting daylight manually stops the automatic day cycle. Turning on the independent conversation background lets the slider below set how strongly the center column is tinted; 100% is Harness\'s native background. Switch it off and the conversation follows the glass opacity above, while the sidebars always use the workspace glass.',
      times: ['Dusk', 'Golden hour', 'Afternoon', 'Midday'],
    },
  });

  const WAVE_ICON = `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
  <path d="M1.5 8.5c1.2-1.7 2.4-1.7 3.6 0s2.4 1.7 3.6 0 1.9-1.2 3-0.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M1.5 12c1.2-1.4 2.4-1.4 3.6 0s2.4 1.4 3.6 0 1.9-1 3-.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>
</svg>`;

  function clamp(value, min, max, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
  }

  function normalize(raw) {
    return {
      enabled: raw.enabled !== false,
      sea: clamp(raw.sea, 0, 100, DEFAULTS.sea),
      time: clamp(raw.time, 0, 100, DEFAULTS.time),
      glass: clamp(raw.glass, 40, 90, DEFAULTS.glass),
      autoCycle: raw.autoCycle !== false,
      chatCustom: raw.chatCustom === true,
      chatOpacity: clamp(raw.chatOpacity, CHAT_OPACITY_MIN, CHAT_OPACITY_MAX, DEFAULTS.chatOpacity),
    };
  }

  function selectCopy(locale) {
    const requested = locale || document.documentElement.lang || navigator.language || 'en';
    return requested.toLowerCase().startsWith('zh') ? COPY.zh : COPY.en;
  }

  function timeLabel(copy, value) {
    const t = value / 100;
    if (t < 0.12) return copy.times[0];
    if (t < 0.30) return copy.times[1];
    if (t < 0.62) return copy.times[2];
    return copy.times[3];
  }

  function alpha(value) {
    return Number(value.toFixed(2));
  }

  // The native center column must look like unthemed Harness. Harness declares
  // its base palette as --dsw-static-neutral-bluish-* on :root and maps the
  // --dsw-alias-bg-* / --dsw-specific-* aliases onto it. We only override the
  // aliases, so re-declaring them from the static palette restores native color
  // inside a subtree without hardcoding hex values from one Harness build.
  const NATIVE_TOKENS = Object.freeze({
    light: {
      '--dsw-alias-bg-base': 'var(--dsw-static-neutral-bluish-00, #fff)',
      '--dsw-alias-bg-layer-1': 'var(--dsw-static-neutral-bluish-00, #fff)',
      '--dsw-alias-bg-layer-2': 'var(--dsw-static-neutral-bluish-00, #fff)',
      '--dsw-alias-bg-layer-3': 'var(--dsw-static-neutral-bluish-00, #fff)',
      '--dsw-alias-bg-module-platform': 'var(--dsw-static-neutral-bluish-60, #f5f6f7)',
      '--dsw-alias-bg-multi-select': 'var(--dsw-static-neutral-bluish-60, #f5f6f7)',
      '--dsw-alias-bg-overlay': 'var(--dsw-static-neutral-bluish-150, #e9ecf2)',
      '--dsw-specific-sidebar-fill': 'var(--dsw-static-neutral-bluish-50, #f9fafb)',
      '--dsw-specific-selector': 'var(--dsw-static-neutral-bluish-60, #f5f6f7)',
    },
    dark: {
      '--dsw-alias-bg-base': 'var(--dsw-static-neutral-bluish-950, #151517)',
      '--dsw-alias-bg-layer-1': 'var(--dsw-static-neutral-bluish-875, #232324)',
      '--dsw-alias-bg-layer-2': 'var(--dsw-static-neutral-bluish-850, #2c2c2e)',
      '--dsw-alias-bg-layer-3': 'var(--dsw-static-neutral-bluish-800, #353638)',
      '--dsw-alias-bg-module-platform': 'var(--dsw-static-neutral-bluish-800, #353638)',
      '--dsw-alias-bg-multi-select': 'var(--dsw-static-neutral-bluish-800, #353638)',
      '--dsw-alias-bg-overlay': 'var(--dsw-static-neutral-bluish-700, #61666b)',
      '--dsw-specific-sidebar-fill': 'var(--dsw-static-neutral-bluish-900, #1b1b1c)',
      '--dsw-specific-selector': 'var(--dsw-static-neutral-bluish-800, #353638)',
    },
  });

  // The conversation column may be given its own opacity. At 100% it has to be
  // indistinguishable from unthemed Harness, so the paint is always derived from
  // Harness's own static palette instead of a hex value copied from one build.
  // color-mix() then scales that native color to any opacity the slider allows.
  function nativeBase(theme) {
    return theme === 'dark'
      ? 'var(--dsw-static-neutral-bluish-950, #151517)'
      : 'var(--dsw-static-neutral-bluish-00, #fff)';
  }

  function chatPercent(opacity) {
    return clamp(opacity, CHAT_OPACITY_MIN, CHAT_OPACITY_MAX, CHAT_OPACITY_MAX);
  }

  function chatPaint(theme, opacity) {
    const percent = chatPercent(opacity);
    if (percent >= CHAT_OPACITY_MAX) return nativeBase(theme);
    return `color-mix(in srgb, ${nativeBase(theme)} ${percent}%, transparent)`;
  }

  function chatTokens(theme, opacity) {
    const percent = chatPercent(opacity);
    const tokens = NATIVE_TOKENS[theme];
    if (percent >= CHAT_OPACITY_MAX) return tokens;
    return Object.fromEntries(Object.entries(tokens)
      .map(([name, value]) => [name, `color-mix(in srgb, ${value} ${percent}%, transparent)`]));
  }

  // Every supported shell exposes the conversation column with a different
  // root: classic Harness Web (`.wSkVaW_root`), the slot wrapper, the community
  // desktop frame and the official 0.2.x AppFrame, whose only stable marker is
  // the shell overlay sibling. Redeclaring Harness's own palette tokens inside
  // that subtree keeps every nested surface that paints `var(--dsw-alias-bg-*)`
  // in step with the column instead of with the workspace glass.
  const CONVERSATION_ROOTS = Object.freeze([
    '.wSkVaW_root',
    '[data-slot="conversation"]',
    '.dshDesktopConversationSurface',
    'div:has(> [data-shell-overlay]) > :nth-child(2):not([data-shell-overlay])',
  ]);

  // Only the outermost column of each shell may paint the background. Painting
  // both a wrapper and the surface nested inside it would stack two translucent
  // layers and render the transcript darker than the slider promises.
  const CONVERSATION_PAINTS = Object.freeze([
    '.wSkVaW_root',
    'body:is([data-dsh-desktop-mode="advanced"], [data-dsh-desktop-mode="extended"]) .dshDesktopConversationSurface',
    'html:is([data-platform="darwin"], [data-windows-titlebar]) body #root div:has(> [data-shell-overlay]) > :nth-child(2)',
  ]);

  function conversationCss(opacity) {
    // Rename only the property names: the values must keep pointing at
    // Harness's own --dsw-static-neutral-bluish-* palette.
    const declarations = (theme, rename) => Object.entries(chatTokens(theme, opacity))
      .map(([name, value]) => `  ${rename(name)}: ${value};`)
      .join('\n');
    const themed = (theme) => `${declarations(theme, (name) => `--bs-chat-${name.slice('--dsw-'.length)}`)}
  --bs-chat-base: ${chatPaint(theme, opacity)};`;
    // Theme is resolved once, at the variable-definition level, where a
    // `body[data-ds-dark-theme]` prefix is valid on its own. The paint rules
    // below stay theme-agnostic: prefixing every shell root instead would emit
    // impossible selectors such as `body[x] html ... body ...`, silently
    // falling back to Harness's light palette in dark mode.
    const roots = CONVERSATION_ROOTS.join(',\n');
    const paints = CONVERSATION_PAINTS.join(',\n');
    const aliases = Object.keys(NATIVE_TOKENS.light)
      .map((name) => `  ${name}: var(--bs-chat-${name.slice('--dsw-'.length)}) !important;`)
      .join('\n');
    return `
/* Independent conversation background: only this column changes, and only up
   to its own opacity. The sidebars always keep the workspace glass. */
:root {
${themed('light')}
}
body[data-ds-dark-theme] {
${themed('dark')}
}
${roots} {
${aliases}
}
${paints} {
  background: var(--bs-chat-base) !important;
}`;
  }

  function glassCss(glass, chatCustom, chatOpacity) {
    const light = glass / 100;
    const dark = Math.max(0.40, light - 0.12);
    // The conversation column gets its own opacity only when the independent
    // control is on. Alpha composites, so a conversation that must end up
    // lighter than the workspace glass cannot sit on top of a shared frame
    // paint: the frame would always show through. In that mode each column
    // paints exactly one layer of its own instead, which also keeps nested
    // fills from compounding.
    const chat = chatCustom ? chatPercent(chatOpacity) : null;
    const independent = chat !== null;
    const communitySurfaces = [
      ...(independent ? [] : ['.dshDesktopSidebarSurface']),
      ...(independent ? [] : [
        '.dshDesktopConversationSurface',
        '.dshDesktopConversationSurface > *',
        '.dshDesktopConversationSurface [data-phase="hero"]',
        '.dshDesktopConversationSurface [data-phase="active"]',
        '.dshDesktopConversationSurface [data-phase="settling"]',
      ]),
      ...(independent ? [] : ['.dshDesktopDetailsSurface']),
      '.dshDesktopMacCaptionRow',
      '.dshDesktopWindowsCaptionRow',
      ...(independent ? [] : ['.dshDesktopDetailsSurface > *']),
    ];
    const officialColumns = independent ? '' : ':first-child, :nth-child(2), [data-rightbar-col]';
    const legacyRoots = independent ? '.pI_x6G_sidebarCol,\n.hHd-Xa_root' : '.wSkVaW_root,\n.pI_x6G_sidebarCol,\n.hHd-Xa_root';
    // Frames and column paints are only rearranged for the independent mode;
    // the shared-glass output stays byte-identical to the default path.
    const independentCss = independent ? `
/* Independent conversation background: the shared frame paint would otherwise
   show through every column, so it is handed back to the columns themselves.
   Each column paints once; nested fills stay transparent. */
body:is([data-dsh-desktop-mode="advanced"], [data-dsh-desktop-mode="extended"]) .dshDesktopFrame,
html:is([data-platform="darwin"], [data-windows-titlebar]) body #root div:has(> [data-shell-overlay]) {
  background: transparent !important;
}
body:is([data-dsh-desktop-mode="advanced"], [data-dsh-desktop-mode="extended"]) :is(
  .dshDesktopSidebarSurface,
  .dshDesktopDetailsSurface
),
html:is([data-platform="darwin"], [data-windows-titlebar]) body #root div:has(> [data-shell-overlay]) > :is(:first-child, [data-rightbar-col]) {
  background: var(--dsw-alias-bg-base) !important;
}
body:is([data-dsh-desktop-mode="advanced"], [data-dsh-desktop-mode="extended"]) :is(
  .dshDesktopConversationSurface > *,
  .dshDesktopConversationSurface [data-phase],
  .dshDesktopDetailsSurface > *
) {
  background: transparent !important;
}` : '';
    return `
/* Backspace: one translucent shell; nested fills must not compound.
   Only the workspace surface (bg-base) and inline fills carry the glass alpha.
   layer-1 / layer-2 back floating Harness UI — hover preview cards, dialogs and
   floating dock windows — which stay near-opaque so their text never shows the
   page behind it through. */
body {
  background: transparent !important;
  --dsw-alias-bg-base: rgba(255, 255, 255, ${alpha(light)}) !important;
  --dsw-alias-bg-layer-1: rgba(255, 255, 255, ${alpha(ELEVATED_ALPHA)}) !important;
  --dsw-alias-bg-layer-2: rgba(255, 255, 255, ${alpha(ELEVATED_ALPHA)}) !important;
  --dsw-alias-bg-layer-3: rgba(255, 255, 255, ${alpha(light)}) !important;
  --dsw-alias-bg-module-platform: rgba(245, 246, 247, ${alpha(light + 0.02)}) !important;
  --dsw-alias-bg-multi-select: rgba(245, 246, 247, ${alpha(light + 0.02)}) !important;
  --dsw-alias-bg-overlay: rgba(233, 236, 242, .97) !important;
  --dsw-specific-sidebar-fill: rgba(249, 250, 251, ${alpha(Math.max(0.36, light - 0.04))}) !important;
  --dsw-specific-selector: rgba(245, 246, 247, ${alpha(light + 0.02)}) !important;
}
body[data-ds-dark-theme] {
  --dsw-alias-bg-base: rgba(9, 12, 16, ${alpha(dark)}) !important;
  --dsw-alias-bg-layer-1: rgba(12, 16, 22, ${alpha(ELEVATED_ALPHA)}) !important;
  --dsw-alias-bg-layer-2: rgba(16, 20, 27, ${alpha(ELEVATED_ALPHA)}) !important;
  --dsw-alias-bg-layer-3: rgba(20, 25, 33, ${alpha(dark)}) !important;
  --dsw-alias-bg-module-platform: rgba(13, 17, 23, ${alpha(dark + 0.02)}) !important;
  --dsw-alias-bg-multi-select: rgba(13, 17, 23, ${alpha(dark + 0.02)}) !important;
  --dsw-alias-bg-overlay: rgba(18, 22, 30, .97) !important;
  --dsw-specific-sidebar-fill: rgba(11, 15, 21, ${alpha(Math.max(0.35, dark - 0.05))}) !important;
  --dsw-specific-selector: rgba(13, 17, 23, ${alpha(dark + 0.02)}) !important;
}
/* DSH Desktop owns a different shell: its transparent sidebar and two
   independently painted conversation layers otherwise produce uneven glass.
   Paint the shared frame once. Only shell roots lose their fill; cards,
   composer, menus and the sibling overlay keep their own theme tokens. */
body:is([data-dsh-desktop-mode="advanced"], [data-dsh-desktop-mode="extended"]) .dshDesktopFrame {
  background: var(--dsw-alias-bg-base) !important;
}
body:is([data-dsh-desktop-mode="advanced"], [data-dsh-desktop-mode="extended"]) .dshDesktopSidebarSurface {
  --dsw-specific-sidebar-fill: transparent !important;
}
${communitySurfaces.length > 0 ? `body:is([data-dsh-desktop-mode="advanced"], [data-dsh-desktop-mode="extended"]) :is(
  ${communitySurfaces.join(',\n  ')}
) {
  background: transparent !important;
}` : ''}
/* Official Harness Desktop 0.2.x uses a different AppFrame from the
   community desktop wrapper. Its sidebar, center, conversation and docked
   rightbar each paint a surface; translucent paints compound into a much
   darker center. The shell overlay is a stable AppFrame marker, while the
   platform attributes keep this adjustment out of ordinary Harness Web. */
html:is([data-platform="darwin"], [data-windows-titlebar]) body #root div:has(> [data-shell-overlay]) {
  background: var(--dsw-alias-bg-base) !important;
}
${officialColumns ? `html:is([data-platform="darwin"], [data-windows-titlebar]) body #root div:has(> [data-shell-overlay]) > :is(${officialColumns}),
`: ''}html:is([data-platform="darwin"], [data-windows-titlebar]) body #root div:has(> [data-shell-overlay]) > :nth-child(2) [data-phase],
html:is([data-platform="darwin"], [data-windows-titlebar]) body #root [data-rightbar-col] [data-dockkit-host="dock"] > [data-dockkit-content] {
  background: transparent !important;
}
html[data-windows-titlebar] body #root div:has(> [data-shell-overlay])::before {
  background: transparent !important;
}
/* Modal cards can be independent body portals, including second-level plugin
   configuration. Protect semantic dialog surfaces, not the full-screen mask
   or shell overlay. Keep this independent of workspace opacity and DOM depth. */
body :is([data-shortcut-modal="settings"], [role="dialog"], [role="alertdialog"]) {
  background: rgba(250, 251, 253, .97) !important;
}
body[data-ds-dark-theme] :is([data-shortcut-modal="settings"], [role="dialog"], [role="alertdialog"]) {
  background: rgba(24, 28, 35, .97) !important;
}
/* Legacy Harness builds: these CSS-module hashes are best-effort fallbacks. */
${legacyRoots} {
  background: transparent !important;
}${independentCss}${independent ? conversationCss(chat) : ''}`;
  }

  function uiCss() {
    return `
#${IDS.button} {
  position: fixed; z-index: 6000; width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 10px; border: 1px solid rgba(255,255,255,.14);
  background: rgba(12,16,22,.58); backdrop-filter: blur(14px) saturate(130%);
  color: #9fb3bd; cursor: pointer; padding: 0;
  transition: color .18s ease, border-color .18s ease, background .18s ease, box-shadow .18s ease, transform .1s ease;
}
#${IDS.button}:hover { color:#8fe9e4; border-color:rgba(143,233,228,.5); background:rgba(16,22,30,.72); }
#${IDS.button}.active { color:#dafdfb; border-color:rgba(143,233,228,.55); background:rgba(143,233,228,.14); box-shadow:0 0 14px rgba(143,233,228,.25); }
#${IDS.button}:active { transform:scale(.94); }
#${IDS.button}:focus-visible, #${IDS.panel} button:focus-visible, #${IDS.panel} input:focus-visible { outline:2px solid rgba(143,233,228,.7); outline-offset:2px; }
#${IDS.panel} {
  position:fixed; z-index:6001; width:250px; padding:16px;
  border-radius:16px; border:1px solid rgba(255,255,255,.14);
  background:rgba(10,14,20,.82); backdrop-filter:blur(22px) saturate(140%);
  box-shadow:0 18px 50px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.1);
  color:#eef4f6; font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;
  display:none;
}
#${IDS.panel}.open { display:block; }
#${IDS.panel} .bs-title { display:flex; align-items:center; justify-content:space-between; font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.6); margin-bottom:14px; }
#${IDS.panel} .bs-mark, #${IDS.panel} .bs-value { color:#8fe9e4; }
#${IDS.panel} .bs-close { background:none; border:0; color:rgba(255,255,255,.55); font-size:18px; line-height:1; cursor:pointer; padding:3px 6px; border-radius:6px; }
#${IDS.panel} .bs-close:hover { color:#fff; background:rgba(255,255,255,.08); }
#${IDS.panel} .bs-row { margin-top:13px; }
/* The conversation slider is a child of its switch: indented, and hidden
   entirely (including from the tab order) while the switch is off. */
#${IDS.panel} .bs-sub { margin-top:9px; padding-left:11px; border-left:2px solid rgba(143,233,228,.28); }
#${IDS.panel} .bs-sub[hidden] { display:none; }
#${IDS.panel} .bs-head { display:flex; align-items:baseline; justify-content:space-between; gap:12px; margin-bottom:9px; font-size:11px; letter-spacing:.1em; color:rgba(255,255,255,.7); }
#${IDS.panel} .bs-value { font-variant-numeric:tabular-nums; }
#${IDS.panel} input[type='range'] { appearance:none; display:block; width:100%; height:14px; margin:0; padding:0; background:transparent; cursor:pointer; }
#${IDS.panel} input[type='range']::-webkit-slider-runnable-track { height:3px; border-radius:2px; background:rgba(255,255,255,.2); }
#${IDS.panel} input[type='range']::-webkit-slider-thumb { appearance:none; width:14px; height:14px; margin-top:-5.5px; border:0; border-radius:50%; background:#8fe9e4; box-shadow:0 0 10px rgba(143,233,228,.75); }
#${IDS.panel} input[type='range']::-moz-range-track { height:3px; border-radius:2px; background:rgba(255,255,255,.2); }
#${IDS.panel} input[type='range']::-moz-range-thumb { width:14px; height:14px; border:0; border-radius:50%; background:#8fe9e4; box-shadow:0 0 10px rgba(143,233,228,.75); }
#${IDS.panel} .bs-note { margin-top:13px; font-size:10px; line-height:1.7; color:rgba(255,255,255,.46); }
#${IDS.panel} .bs-switch { display:flex; align-items:center; justify-content:space-between; gap:12px; }
#${IDS.panel} .bs-switch label { font-size:11px; color:rgba(255,255,255,.7); }
#${IDS.panel} .bs-switch input[type='checkbox'] { width:15px; height:15px; margin:0; accent-color:#8fe9e4; cursor:pointer; }
#${IDS.panel} .bs-reset { width:100%; margin-top:4px; padding:7px 0; border-radius:8px; border:1px solid rgba(255,255,255,.14); background:rgba(255,255,255,.06); color:#eef4f6; font-size:11px; cursor:pointer; transition:background .15s ease, border-color .15s ease; }
#${IDS.panel} .bs-reset:hover { background:rgba(143,233,228,.12); border-color:rgba(143,233,228,.4); }
@media (prefers-reduced-motion: reduce) {
  #${IDS.button}, #${IDS.panel}, #${IDS.panel} * { transition:none !important; }
}`;
  }

  function createController(options) {
    if (!options || typeof options.assetUrl !== 'function' || !options.storage) {
      throw new TypeError('BackspaceSkinCore requires assetUrl() and storage adapters.');
    }

    let copy = selectCopy(options.locale);
    let state = { ...DEFAULTS };
    let ownsSurface = false;
    let panelOpen = false;
    let previousFocus = null;
    let placementObserver = null;
    let placementFrame = 0;
    const surfaceCleanups = [];
    const controllerCleanups = [];

    const on = (target, event, listener, settings) => {
      target.addEventListener(event, listener, settings);
      surfaceCleanups.push(() => target.removeEventListener(event, listener, settings));
    };

    const save = (patch) => {
      state = normalize({ ...state, ...patch });
      return Promise.resolve(options.storage.set(patch)).catch((error) => {
        console.warn('[Backspace] Failed to save settings.', error);
      });
    };

    const updateGlass = () => {
      const style = document.getElementById(IDS.glass);
      if (style) style.textContent = glassCss(state.glass, state.chatCustom, state.chatOpacity);
    };

    const postToOcean = () => {
      const frame = document.getElementById(IDS.frame);
      if (!(frame instanceof HTMLIFrameElement) || !frame.contentWindow) return;
      let targetOrigin = '*';
      try { targetOrigin = new URL(frame.src).origin; } catch { /* local test documents may have no absolute base URL */ }
      frame.contentWindow.postMessage({
        type: 'bs-set', sea: state.sea, t: state.time, auto: state.autoCycle,
      }, targetOrigin);
    };

    const placeButton = () => {
      const button = document.getElementById(IDS.button);
      if (!(button instanceof HTMLElement)) return;
      const selectors = [
        '[data-slot="sidebar.settings"] button',
        '[data-testid="settings-trigger"]',
        '.VOzbGW_trigger',
      ];
      const trigger = selectors.map((selector) => document.querySelector(selector))
        .find((candidate) => candidate instanceof HTMLElement && candidate.getBoundingClientRect().width > 0);
      if (trigger instanceof HTMLElement) {
        const rect = trigger.getBoundingClientRect();
        button.style.left = `${Math.round(rect.right + 8)}px`;
        button.style.top = `${Math.round(rect.top + rect.height / 2 - 17)}px`;
        button.style.bottom = 'auto';
      } else {
        button.style.left = '16px';
        button.style.bottom = '16px';
        button.style.top = 'auto';
      }
    };

    const schedulePlace = () => {
      cancelAnimationFrame(placementFrame);
      placementFrame = requestAnimationFrame(placeButton);
    };

    const setPanelOpen = (open) => {
      const button = document.getElementById(IDS.button);
      const panel = document.getElementById(IDS.panel);
      if (!(button instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) return;
      panelOpen = open;
      panel.classList.toggle('open', open);
      button.classList.toggle('active', open);
      button.setAttribute('aria-expanded', String(open));
      if (open) {
        previousFocus = document.activeElement;
        const rect = button.getBoundingClientRect();
        panel.style.left = `${Math.min(Math.max(12, rect.left - panel.offsetWidth + 34), window.innerWidth - panel.offsetWidth - 12)}px`;
        panel.style.bottom = `${Math.max(12, window.innerHeight - rect.top + 10)}px`;
        panel.querySelector('input')?.focus();
      } else if (previousFocus instanceof HTMLElement) {
        previousFocus.focus();
      }
    };

    const mountOcean = () => {
      const root = document.body || document.documentElement;
      if (!root || document.getElementById(IDS.frame)) return false;
      const frame = document.createElement('iframe');
      const query = new URLSearchParams({
        skin: '1',
        sea: String(state.sea),
        t: String(state.time),
        auto: state.autoCycle ? '1' : '0',
        parentOrigin: location.origin,
      });
      frame.id = IDS.frame;
      frame.src = `${options.assetUrl('skin.html')}?${query}`;
      frame.setAttribute('aria-hidden', 'true');
      frame.setAttribute('tabindex', '-1');
      frame.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;border:0;z-index:0;pointer-events:none;background:transparent;';
      root.insertBefore(frame, root.firstChild);

      const style = document.createElement('style');
      style.id = IDS.glass;
      style.textContent = glassCss(state.glass, state.chatCustom, state.chatOpacity);
      (document.head || document.documentElement).appendChild(style);
      ownsSurface = true;
      return true;
    };

    const mountUi = () => {
      if (document.getElementById(IDS.button)) return;
      const style = document.createElement('style');
      style.id = IDS.uiStyle;
      style.textContent = uiCss();
      (document.head || document.documentElement).appendChild(style);

      const button = document.createElement('button');
      button.id = IDS.button;
      button.type = 'button';
      button.title = copy.button;
      button.setAttribute('aria-label', copy.button);
      button.setAttribute('aria-controls', IDS.panel);
      button.setAttribute('aria-expanded', 'false');
      button.innerHTML = WAVE_ICON;

      const panel = document.createElement('div');
      panel.id = IDS.panel;
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'false');
      panel.setAttribute('aria-label', copy.button);
      panel.innerHTML = `
        <div class="bs-title"><span>BACKSPACE <span class="bs-mark">·</span> SKIN</span><button class="bs-close" type="button" aria-label="${copy.close}">×</button></div>
        <div class="bs-row"><div class="bs-head"><label for="${IDS.panel}-sea-range">${copy.sea}</label><output class="bs-value" id="${IDS.panel}-sea" for="${IDS.panel}-sea-range"></output></div><input type="range" id="${IDS.panel}-sea-range" min="0" max="100" step="1" /></div>
        <div class="bs-row"><div class="bs-head"><label for="${IDS.panel}-time-range">${copy.time}</label><output class="bs-value" id="${IDS.panel}-time" for="${IDS.panel}-time-range"></output></div><input type="range" id="${IDS.panel}-time-range" min="0" max="100" step="1" /></div>
        <div class="bs-row"><div class="bs-head"><label for="${IDS.panel}-glass-range">${copy.glass}</label><output class="bs-value" id="${IDS.panel}-glass" for="${IDS.panel}-glass-range"></output></div><input type="range" id="${IDS.panel}-glass-range" min="40" max="90" step="1" /></div>
        <div class="bs-row bs-switch"><label for="${IDS.panel}-enabled">${copy.enable}</label><input type="checkbox" id="${IDS.panel}-enabled" /></div>
        <div class="bs-row bs-switch"><label for="${IDS.panel}-cycle">${copy.autoCycle}</label><input type="checkbox" id="${IDS.panel}-cycle" /></div>
        <div class="bs-row bs-switch"><label for="${IDS.panel}-chat">${copy.chatCustom}</label><input type="checkbox" id="${IDS.panel}-chat" /></div>
        <div class="bs-row bs-sub" id="${IDS.panel}-chat-row"><div class="bs-head"><label for="${IDS.panel}-chat-range">${copy.chatOpacity}</label><output class="bs-value" id="${IDS.panel}-chat-value" for="${IDS.panel}-chat-range"></output></div><input type="range" id="${IDS.panel}-chat-range" min="${CHAT_OPACITY_MIN}" max="${CHAT_OPACITY_MAX}" step="1" /></div>
        <div class="bs-row"><button type="button" class="bs-reset">${copy.reset}</button></div>
        <p class="bs-note">${copy.resetNote}<br>${copy.note}</p>`;

      const host = document.body || document.documentElement;
      host.append(button, panel);

      const seaRange = panel.querySelector(`#${IDS.panel}-sea-range`);
      const timeRange = panel.querySelector(`#${IDS.panel}-time-range`);
      const glassRange = panel.querySelector(`#${IDS.panel}-glass-range`);
      const seaOut = panel.querySelector(`#${IDS.panel}-sea`);
      const timeOut = panel.querySelector(`#${IDS.panel}-time`);
      const glassOut = panel.querySelector(`#${IDS.panel}-glass`);
      const enabledBox = panel.querySelector(`#${IDS.panel}-enabled`);
      const cycleBox = panel.querySelector(`#${IDS.panel}-cycle`);
      const chatBox = panel.querySelector(`#${IDS.panel}-chat`);
      const chatRow = panel.querySelector(`#${IDS.panel}-chat-row`);
      const chatRange = panel.querySelector(`#${IDS.panel}-chat-range`);
      const chatOut = panel.querySelector(`#${IDS.panel}-chat-value`);
      const resetBtn = panel.querySelector('.bs-reset');

      const syncUi = () => {
        seaRange.value = String(state.sea);
        timeRange.value = String(state.time);
        glassRange.value = String(state.glass);
        seaOut.textContent = String(state.sea).padStart(2, '0');
        timeOut.textContent = timeLabel(copy, state.time);
        glassOut.textContent = `${state.glass}%`;
        enabledBox.checked = state.enabled;
        cycleBox.checked = state.autoCycle;
        chatBox.checked = state.chatCustom;
        chatRange.value = String(state.chatOpacity);
        chatOut.textContent = `${state.chatOpacity}%`;
        // The slider belongs to the switch: hide it while the conversation
        // follows the workspace glass so the panel keeps one obvious meaning.
        chatRow.hidden = !state.chatCustom;
      };
      syncUi();

      // Harness may set lang after boot. Update only our own UI, in both
      // directions, without replacing controls or losing focus/listeners.
      const syncLocale = () => {
        copy = selectCopy(options.locale);
        button.title = copy.button;
        button.setAttribute('aria-label', copy.button);
        panel.setAttribute('aria-label', copy.button);
        panel.querySelector('.bs-close').setAttribute('aria-label', copy.close);
        for (const [suffix, key] of [['sea-range', 'sea'], ['time-range', 'time'], ['glass-range', 'glass'], ['enabled', 'enable'], ['cycle', 'autoCycle'], ['chat', 'chatCustom'], ['chat-range', 'chatOpacity']]) {
          panel.querySelector(`label[for="${IDS.panel}-${suffix}"]`).textContent = copy[key];
        }
        resetBtn.textContent = copy.reset;
        panel.querySelector('.bs-note').replaceChildren(copy.resetNote, document.createElement('br'), copy.note);
        timeOut.textContent = timeLabel(copy, state.time);
      };
      syncLocale();
      const localeObserver = new MutationObserver(syncLocale);
      localeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
      surfaceCleanups.push(() => localeObserver.disconnect());

      on(seaRange, 'input', () => {
        state.sea = clamp(seaRange.value, 0, 100, DEFAULTS.sea);
        seaOut.textContent = String(state.sea).padStart(2, '0');
        void save({ sea: state.sea });
        postToOcean();
      });
      on(timeRange, 'input', () => {
        state.time = clamp(timeRange.value, 0, 100, DEFAULTS.time);
        state.autoCycle = false;
        timeOut.textContent = timeLabel(copy, state.time);
        cycleBox.checked = false;
        void save({ time: state.time, autoCycle: false });
        postToOcean();
      });
      on(glassRange, 'input', () => {
        state.glass = clamp(glassRange.value, 40, 90, DEFAULTS.glass);
        glassOut.textContent = `${state.glass}%`;
        updateGlass();
        void save({ glass: state.glass });
      });

      on(enabledBox, 'change', () => {
        state.enabled = enabledBox.checked;
        void save({ enabled: state.enabled });
        // Only tear down the ocean surface, never the button/panel: otherwise
        // a disabled skin has no settings entry left to re-enable it.
        applyEnabled();
      });
      on(cycleBox, 'change', () => {
        state.autoCycle = cycleBox.checked;
        void save({ autoCycle: state.autoCycle });
        postToOcean();
      });
      on(chatBox, 'change', () => {
        state.chatCustom = chatBox.checked;
        chatRow.hidden = !state.chatCustom;
        void save({ chatCustom: state.chatCustom });
        updateGlass();
      });
      on(chatRange, 'input', () => {
        state.chatOpacity = clamp(chatRange.value, CHAT_OPACITY_MIN, CHAT_OPACITY_MAX, DEFAULTS.chatOpacity);
        chatOut.textContent = `${state.chatOpacity}%`;
        void save({ chatOpacity: state.chatOpacity });
        updateGlass();
      });
      on(resetBtn, 'click', () => {
        void save({ ...DEFAULTS }).then(() => {
          syncUi();
          updateGlass();
          postToOcean();
          applyEnabled();
        });
      });

      on(button, 'click', () => setPanelOpen(!panelOpen));
      on(panel.querySelector('.bs-close'), 'click', () => setPanelOpen(false));
      on(document, 'click', (event) => {
        if (panelOpen && !panel.contains(event.target) && !button.contains(event.target)) setPanelOpen(false);
      });
      on(document, 'keydown', (event) => {
        if (!panelOpen) return;
        if (event.key === 'Escape') {
          event.preventDefault();
          setPanelOpen(false);
          return;
        }
        if (event.key !== 'Tab') return;
        const focusable = [...panel.querySelectorAll('button, input')].filter((element) => !element.disabled);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      });
      on(window, 'resize', () => { if (!panelOpen) schedulePlace(); });

      placementObserver = new MutationObserver(schedulePlace);
      placementObserver.observe(host, { childList: true, subtree: true });
      schedulePlace();
    };

    const unmount = () => {
      panelOpen = false;
      placementObserver?.disconnect();
      placementObserver = null;
      cancelAnimationFrame(placementFrame);
      while (surfaceCleanups.length > 0) surfaceCleanups.pop()();
      if (ownsSurface) {
        document.getElementById(IDS.frame)?.remove();
        document.getElementById(IDS.glass)?.remove();
      }
      document.getElementById(IDS.button)?.remove();
      document.getElementById(IDS.panel)?.remove();
      document.getElementById(IDS.uiStyle)?.remove();
      ownsSurface = false;
    };

    const applyEnabled = () => {
      // The button/panel are the only way back in: mount the UI entry
      // regardless of enabled state, so a skin that starts disabled (or on a
      // host page that saved disabled) still offers the enable switch
      // (2026-08-23: previously the button was created only on first enable,
      // leaving a disabled-after-reload skin with no entry point at all).
      if (!document.getElementById(IDS.button)) mountUi();
      if (!state.enabled) {
        // Tear down only the ocean surface (frame + glass), keeping the
        // button/panel so the skin can be re-enabled from the same page.
        if (ownsSurface) {
          document.getElementById(IDS.frame)?.remove();
          document.getElementById(IDS.glass)?.remove();
          ownsSurface = false;
        }
        return;
      }
      // The extension and both native paths intentionally share the same ids.
      // Whichever implementation mounted first owns the surface; later ones
      // leave it untouched instead of double-rendering WebGPU.
      if (document.getElementById(IDS.frame)) return;
      if (mountOcean()) mountUi();
    };

    const ready = () => new Promise((resolve) => {
      if (document.body) { resolve(); return; }
      document.addEventListener('DOMContentLoaded', resolve, { once: true });
    });

    const start = async () => {
      await ready();
      try {
        state = normalize(await options.storage.get(DEFAULTS));
      } catch (error) {
        console.warn('[Backspace] Failed to load settings; using defaults.', error);
      }
      applyEnabled();
      if (typeof options.listen === 'function') {
        const dispose = options.listen((patch) => {
          state = normalize({ ...state, ...patch });
          applyEnabled();
          updateGlass();
          postToOcean();
        });
        if (typeof dispose === 'function') controllerCleanups.push(dispose);
      }
    };

    const stop = () => {
      unmount();
      while (controllerCleanups.length > 0) controllerCleanups.pop()();
    };

    return Object.freeze({ start, stop, getState: () => ({ ...state }) });
  }

  global.BackspaceSkinCore = Object.freeze({ createController, DEFAULTS, IDS });
})(globalThis);


  const KEYS = Object.freeze({
    enabled: 'bsEnabled',
    sea: 'bsSea',
    time: 'bsTime',
    glass: 'bsGlass',
    autoCycle: 'bsAutoCycle',
    chatCustom: 'bsChatCustom',
    chatOpacity: 'bsChatOpacity',
  });

  function readSetting(key, fallback) {
    try {
      const value = localStorage.getItem(KEYS[key]);
      if (value === null) return fallback;
      if (key === 'enabled' || key === 'autoCycle') return value !== 'false';
      if (key === 'chatCustom') return value === 'true';
      return Number(value);
    } catch {
      return fallback;
    }
  }

  exports.name = 'dsh-backspace-client';
  exports.inject = [];
  exports.apply = function apply(ctx) {
    const controller = globalThis.BackspaceSkinCore.createController({
      assetUrl: (path) => '/dsh-backspace/' + path,
      storage: {
        get: async (defaults) => ({
          enabled: readSetting('enabled', defaults.enabled),
          sea: readSetting('sea', defaults.sea),
          time: readSetting('time', defaults.time),
          glass: readSetting('glass', defaults.glass),
          autoCycle: readSetting('autoCycle', defaults.autoCycle),
          chatCustom: readSetting('chatCustom', defaults.chatCustom),
          chatOpacity: readSetting('chatOpacity', defaults.chatOpacity),
        }),
        set: async (patch) => {
          try {
            for (const [key, value] of Object.entries(patch)) {
              localStorage.setItem(KEYS[key], String(value));
            }
          } catch {
            // Locked-down storage keeps the live value for this page.
          }
        },
      },
    });
    void controller.start();
    ctx.effect(() => () => controller.stop(), 'dsh-backspace: browser surface');
  };

  return module.exports;
}});
