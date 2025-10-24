export const palette = {
  globalBackground: '#0B0F12', // HSL 210, 27%, 6%
  surface1: '#12171B', // HSL 210, 28%, 9%
  surface2: '#171D22', // HSL 208, 26%, 12%
  surface3: '#1E252B', // HSL 210, 22%, 16%
  primary: '#19C37D', // HSL 152, 76%, 44%
  primaryDark: '#11A968', // HSL 152, 81%, 37%
  primaryLight: '#CFF7E6', // HSL 152, 73%, 90%
  secondary: '#3BA3F7', // HSL 207, 91%, 61%
  accent: '#F5A524', // HSL 38, 91%, 55%
  success: '#22C55E', // HSL 142, 64%, 47%
  warning: '#F59E0B', // HSL 38, 92%, 50%
  error: '#EF4444', // HSL 0, 83%, 61%
  info: '#60A5FA', // HSL 215, 89%, 70%
  danger: '#DC2626', // HSL 0, 78%, 51%
  onBg1: '#E6E9EC',
  onBg2: '#C2C8CD',
  onSurface: '#DDE1E5',
};

export const tokens = {
  'bg.default': palette.globalBackground,
  'bg.muted': '#0E1317',
  'surface.default': palette.surface1,
  'surface.raised': palette.surface3,
  'surface.overlay': 'rgba(0,0,0,0.44)',
  'text.primary': palette.onBg1,
  'text.secondary': palette.onBg2,
  'text.muted': '#97A0A9',
  'text.inverse': palette.globalBackground,
  'brand.primary': palette.primary,
  'brand.primary.strong': palette.primaryDark,
  'brand.primary.on': '#062016',
  'brand.secondary': palette.secondary,
  'state.success.fg': palette.success,
  'state.warning.fg': palette.warning,
  'state.accent.fg': palette.accent,
  'state.error.fg': palette.error,
  'state.danger.fg': palette.danger,
};

export const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: tokens['brand.primary'],
    tabIconDefault: '#ccc',
    tabIconSelected: tokens['brand.primary'],
    ...tokens,
  },
  dark: {
    text: '#fff',
    background: tokens['bg.default'],
    tint: tokens['brand.primary'],
    tabIconDefault: '#ccc',
    tabIconSelected: tokens['brand.primary'],
    ...tokens,
  },
};
