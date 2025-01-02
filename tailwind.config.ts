import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
			// QIK Primary
			'qik-pri-100': '#ebfaff',
			'qik-pri-200': '#c2f0ff',
			'qik-pri-300': '#99e6ff',
			'qik-pri-400': '#69D9FF',
			'qik-pri-500': '#47D1FF',
			'qik-pri-600': '#1FC7FF',
			'qik-pri-700': '#00B8F5',
			'qik-pri-800': '#0099CC',
			'qik-pri-900': '#007AA3',
		  	// QIK Secondary
			'qik-sec-100': '#85CEFE',
			'qik-sec-200': '#5DBEFE',
			'qik-sec-300': '#34ADFE',
			'qik-sec-400': '#0B9DFE',
			'qik-sec-500': '#0186DF',
			'qik-sec-600': '#016FB9',
			'qik-sec-700': '#01568E',
			'qik-sec-800': '#013D65',
			'qik-sec-900': '#00253D',
		  	// QIK Tertiary
		  	'qik-ter-100': '#B2FBE5',
		  	'qik-ter-200': '#8BF8D8',
		  	'qik-ter-300': '#65F6CA',
		  	'qik-ter-400': '#3EF4BD',
		  	'qik-ter-500': '#18F2B2',
		  	'qik-ter-600': '#0CD498',
		  	'qik-ter-700': '#0AAE7C',
		  	'qik-ter-800': '#088761',
		  	'qik-ter-900': '#066045',
		  	// QIK Others
		  	'qik-alert': '#101935',
		  	'qik-dark': '#ED474A',
		  	'qik-interactive-1': '#ACF218'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		boxShadow: {
			'qele-panel': '0px 2px 20px 0px rgba(98, 98, 98, 0.08), 0px 1px 8px 0px rgba(98, 98, 98, 0.06)',
			'qele-drawer': '0px 2px 24px 1px rgba(98, 98, 98, 0.10), 0px 1px 10px 1px rgba(98, 98, 98, 0.06'				
		},
		keyframes: {
			numEntry: {
				'0%': {
					transform: 'translate(0, -50%)',
					opacity: '0%'
				},
				'70%': {
					transform: 'translate(0, 30%)',
					opacity: '100%'
				},
				'100%': {
					transform: 'translate(0, 0)',
					opacity: '100%'
				}
			},
			m12: {
				'0%': {
					'background-color': "#69d9ff",
					transform: 'translate(0, 0)'
				},
				'25%': {
					'background-color': "#18f2b2",
					transform: 'translate(0, -30%)'
				},
				'50%': {
					'background-color': "#18f2b2",
					transform: 'translate(0, -60%)'
				},
				'75%': {
					'background-color': "#69d9ff",
					transform: 'translate(0, -30%)'
				},
				'100%': {
					'background-color': "#69d9ff",
					transform: 'translate(0, 0)'
				},
			},
			m3: {
				'0%': {
					'background-color': "#69d9ff",
					transform: 'translate(0, 0)'
				},
				'25%': {
					'background-color': "#69d9ff",
					transform: 'translate(0, 10%)'
				},
				'50%': {
					'background-color': "#18f2b2",
					transform: 'translate(0, 20%)'
				},
				'75%': {
					'background-color': "#18f2b2",
					transform: 'translate(0, 10%)'
				},
				'100%': {
					'background-color': "#69d9ff",
					transform: 'translate(0, 0)'
				},
			},
			m4: {
				'0%': {
					'background-color': "#18f2b2",
					transform: 'translate(0, 0)'
				},
				'25%': {
					'background-color': "#69d9ff",
					transform: 'translate(0, 20%)'
				},
				'50%': {
					'background-color': "#69d9ff",
					transform: 'translate(0, 40%)'
				},
				'75%': {
					'background-color': "#18f2b2",
					transform: 'translate(0, 20%)'
				},
				'100%': {
					'background-color': "#18f2b2",
					transform: 'translate(0, 0)'
				},
			},
			m5: {
				'0%': {
					'background-color': "#18f2b2",
					transform: 'translate(0, 0)'
				},
				'25%': {
					'background-color': "#18f2b2",
					transform: 'translate(0, -10%)'
				},
				'50%': {
					'background-color': "#69d9ff",
					transform: 'translate(0, -20%)'
				},
				'75%': {
					'background-color': "#69d9ff",
					transform: 'translate(0, -10%)'
				},
				'100%': {
					'background-color': "#18f2b2",
					transform: 'translate(0, 0)'
				},
			},
			s1: {
				'0%': {
					'background-color': "#016fb9",
					transform: 'translate(0, 0)'
				},
				'25%': {
					'background-color': "#69d9ff",
					transform: 'translate(0, 20%)'
				},
				'50%': {
					'background-color': "#69d9ff",
					transform: 'translate(0, 40%)'
				},
				'75%': {
					'background-color': "#016fb9",
					transform: 'translate(0, 20%)'
				},
				'100%': {
					'background-color': "#016fb9",
					transform: 'translate(0, 0)'
				},
			},
			s2: {
				'0%': {
					'background-color': "#016fb9",
					transform: 'translate(0, 0)'
				},
				'25%': {
					'background-color': "#016fb9",
					transform: 'translate(-10%, -20%)'
				},
				'50%': {
					'background-color': "#69d9ff",
					transform: 'translate(-20%, -40%)'
				},
				'75%': {
					'background-color': "#69d9ff",
					transform: 'translate(-10%, -20%)'
				},
				'100%': {
					'background-color': "#016fb9",
					transform: 'translate(0, 0)'
				},
			},
			s3: {
				'0%': {
					'background-color': "#18f2b2",
					transform: 'translate(0, 0)'
				},
				'25%': {
					'background-color': "#69d9ff",
					transform: 'translate(10%, 20%)'
				},
				'50%': {
					'background-color': "#69d9ff",
					transform: 'translate(20%, 40%)'
				},
				'75%': {
					'background-color': "#69d9ff",
					transform: 'translate(10%, 20%)'
				},
				'100%': {
					'background-color': "#18f2b2",
					transform: 'translate(0, 0)'
				},
			},
			s4: {
				'0%': {
					'background-color': "#69d9ff",
					transform: 'translate(0, 0)'
				},
				'25%': {
					'background-color': "#69d9ff",
					transform: 'translate(20%, 20%)'
				},
				'50%': {
					'background-color': "#69d9ff",
					transform: 'translate(30%, 30%)'
				},
				'75%': {
					'background-color': "#69d9ff",
					transform: 'translate(20%, 20%)'
				},
				'100%': {
					'background-color': "#69d9ff",
					transform: 'translate(0, 0)'
				},
			},
		},
		animation: {
			numEntry: 'numEntry 300ms ease-in-out',
			m12: 'm12 4s linear infinite',
			m3: 'm3 4s linear infinite',
			m4: 'm4 4s linear infinite',
			m5: 'm5 4s linear infinite',
			s1: 's1 4s linear infinite',
			s2: 's2 4s linear infinite',
			s3: 's3 4s linear infinite',
			s4: 's4 4s linear infinite',
		}
  	}
  },
};
export default config;
