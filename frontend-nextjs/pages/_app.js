import '../styles/globals.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { Toaster } from 'react-hot-toast'
import { MantineProvider, createTheme } from '@mantine/core'
import dynamic from 'next/dynamic'
import Layout from '../components/Layout'

// Import Notifications without SSR to avoid provider issues
const Notifications = dynamic(
  () => import('@mantine/notifications').then((mod) => mod.Notifications),
  { ssr: false }
)

const theme = createTheme({
  primaryColor: 'brand',
  defaultRadius: 'md',
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    fontWeight: '600',
  },
  colors: {
    brand: [
      '#f0f9fd',
      '#e1f5fc',
      '#c3e9f8',
      '#9dd9f3',
      '#6fc6eb',
      '#4ab4e3',
      '#1c96c5', // Your custom color
      '#1a87b8',
      '#1875a3',
      '#16638a'
    ],
    gray: [
      '#fafafa',
      '#f4f4f5',
      '#e4e4e7',
      '#d4d4d8',
      '#a1a1aa',
      '#71717a',
      '#52525b',
      '#3f3f46',
      '#27272a',
      '#18181b'
    ]
  },
  components: {
    Card: {
      defaultProps: {
        shadow: 'xs',
        radius: 'lg',
        withBorder: true,
      },
      styles: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-2px)',
          }
        }
      }
    },
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Badge: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
})

export default function App({ Component, pageProps }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#374151',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            border: '1px solid #e5e7eb',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </MantineProvider>
  )
} 