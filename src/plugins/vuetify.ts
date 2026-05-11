import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#0d9488',
          secondary: '#0f766e',
          surface: '#f8fafc',
        },
      },
    },
  },
})
