import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  FileText, 
  Zap, 
  Bot, 
  TrendingUp,
  Activity,
  Menu,
  X
} from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Shield },
  { name: 'Automated Threat Hunting', href: '/automated-threat-hunting', icon: Search },
  { name: 'Alert Triage', href: '/alert-triage', icon: AlertTriangle },
  { name: 'Incident Case Builder', href: '/incident-case-builder', icon: FileText },
  { name: 'Response Automation', href: '/response-automation', icon: Zap },
  { name: 'Analyst Copilot', href: '/analyst-copilot', icon: Bot },
  { name: 'Predictive Defense', href: '/predictive-defense', icon: TrendingUp },
  { name: 'SRE Health', href: '/sre-health', icon: Activity },
]

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex' }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: 50,
          display: 'block'
        }}>
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(75, 85, 99, 0.75)' 
            }} 
            onClick={() => setSidebarOpen(false)} 
          />
          <div style={{ 
            position: 'relative', 
            display: 'flex', 
            width: '100%', 
            maxWidth: '20rem', 
            flex: 1, 
            flexDirection: 'column', 
            backgroundColor: 'white', 
            borderRight: '1px solid #d1d5db'
          }}>
            <div style={{ 
              display: 'flex', 
              height: '5rem', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '0 1.5rem', 
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', backgroundColor: '#1e40af', borderRadius: '0.75rem' }}>
                  <Shield style={{ height: '1.75rem', width: '1.75rem', color: 'white' }} />
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e40af' }}>
                    Cisco XDR
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '-0.25rem' }}>
                    Next Gen Security
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{ color: '#9ca3af', cursor: 'pointer' }}
              >
                <X style={{ height: '1.5rem', width: '1.5rem' }} />
              </button>
            </div>
            <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      borderRadius: '0.75rem',
                      transition: 'all 0.2s',
                      textDecoration: 'none',
                      backgroundColor: isActive ? '#1e40af' : 'transparent',
                      color: isActive ? 'white' : '#374151'
                    }}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon style={{ 
                      marginRight: '0.75rem', 
                      height: '1.25rem', 
                      width: '1.25rem', 
                      flexShrink: 0,
                      color: isActive ? 'white' : '#6b7280'
                    }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div style={{ 
        display: 'flex',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        width: '18rem',
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRight: '1px solid #d1d5db',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        zIndex: 10
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1
        }}>
          <div style={{ 
            display: 'flex', 
            height: '5rem', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '0 1.5rem', 
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.5rem', backgroundColor: '#1e40af', borderRadius: '0.75rem' }}>
                <Shield style={{ height: '1.75rem', width: '1.75rem', color: 'white' }} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e40af' }}>
                  Cisco XDR
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '-0.25rem' }}>
                  Next Gen Security
                </div>
              </div>
            </div>
            <button
              type="button"
              style={{ 
                color: '#374151', 
                cursor: 'pointer',
                display: 'none'
              }}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu style={{ height: '1.5rem', width: '1.5rem' }} />
            </button>
          </div>
          <nav style={{ 
            flex: 1, 
            padding: '1rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.5rem'
          }}>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    borderRadius: '0.75rem',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                    backgroundColor: isActive ? '#1e40af' : 'transparent',
                    color: isActive ? 'white' : '#374151'
                  }}
                >
                  <item.icon style={{ 
                    marginRight: '0.75rem', 
                    height: '1.25rem', 
                    width: '1.25rem', 
                    flexShrink: 0,
                    color: isActive ? 'white' : '#6b7280'
                  }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div style={{ 
        flex: 1,
        marginLeft: '18rem',
        minHeight: '100vh'
      }}>
        {/* Page content */}
        <main style={{ backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
          <div style={{ 
            maxWidth: '80rem', 
            margin: '0 auto', 
            padding: '2rem'
          }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}