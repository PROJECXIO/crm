import frappeUIPreset from 'frappe-ui/src/tailwind/preset'

export default {
  presets: [frappeUIPreset],
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/frappe-ui/src/**/*.{vue,js,ts,jsx,tsx}',
    '../node_modules/frappe-ui/src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/frappe-ui/frappe/**/*.{vue,js,ts,jsx,tsx}',
    '../node_modules/frappe-ui/frappe/**/*.{vue,js,ts,jsx,tsx}',
  ],
  safelist: [{ pattern: /!(text|bg)-/, variants: ['hover', 'active'] }],
  theme: {
    extend: {
			colors: {
				'text-green': '#00664D',
				subheading: '#00291F',
				dark: '#212121',
				'bg-green': '#00AA80',
				'bg-hover': '#00AA8066',
        gold: '#F9F7ED',
        'gold-bolder': '#F2ECCF',
        'main-bg': '#fff',
        'sidebar-bg': '#FBF6F2'
        // "#FBF6F2" 10 website
			},
			boxShadow: {
				section: '-9px 9px 40px 0px rgba(0, 0, 0, 0.08)',
				custom: '-9px 9px 40px 0px #00000014',
			},
		},
  },
  plugins: [],
}
