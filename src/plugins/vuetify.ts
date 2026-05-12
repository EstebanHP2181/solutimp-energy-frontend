import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#0066d9',
          secondary: '#0a84ff',
          surface: '#0a1628',
          background: '#061426',
        },
      },
    },
  },
})
