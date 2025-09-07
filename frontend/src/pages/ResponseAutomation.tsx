import { Zap, Play, Pause, Shield, User, Monitor, Lock, Globe, CheckCircle, XCircle, AlertTriangle, Target, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ResponseAutomation() {
  const actions = [
    {
      id: 1,
      title: "Endpoint Quarantine",
      description: "Automatically isolate compromised endpoint from network to prevent lateral movement.",
      type: "quarantine",
      target: "Workstation-IT-001",
      status: "completed",
      timestamp: "5 minutes ago",
      confidence: 94,
      approved: true
    },
    {
      id: 2,
      title: "Domain Blocking",
      description: "Block malicious domain to prevent further communication with command and control servers.",
      type: "block",
      target: "malicious-domain.com",
      status: "pending",
      timestamp: "2 minutes ago",
      confidence: 87,
      approved: false
    },
    {
      id: 3,
      title: "Account Disable",
      description: "Disable compromised user account to prevent unauthorized access and privilege escalation.",
      type: "disable",
      target: "john.doe@company.com",
      status: "requires_approval",
      timestamp: "1 minute ago",
      confidence: 76,
      approved: false
    },
    {
      id: 4,
      title: "Firewall Rule Update",
      description: "Add firewall rule to block suspicious IP addresses and prevent further network access.",
      type: "firewall",
      target: "192.168.1.100",
      status: "completed",
      timestamp: "10 minutes ago",
      confidence: 91,
      approved: true
    }
  ]

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'quarantine': return Monitor
      case 'block': return Globe
      case 'disable': return User
      case 'firewall': return Shield
      default: return Zap
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#16a34a'
      case 'pending': return '#d97706'
      case 'requires_approval': return '#dc2626'
      default: return '#6b7280'
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Main Container */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem' }}>
        {/* Header Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem', marginBottom: '2rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '2rem', height: '2rem', backgroundColor: '#1e40af', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap style={{ height: '1.25rem', width: '1.25rem', color: 'white' }} />
              </div>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <h1 style={{ 
                  fontSize: '1.875rem', 
                  fontWeight: 'bold', 
                  color: 'black', 
                  cursor: 'pointer', 
                  transition: 'color 0.2s ease'
                }}>
                  Response Automation
                </h1>
              </Link>
            </div>
          </div>
          
          {/* Cisco blue separator line */}
          <div style={{ height: '0.25rem', backgroundColor: '#1e40af', borderRadius: '9999px', marginBottom: '2rem' }}></div>

          {/* Description */}
          <p style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: '1.625', marginBottom: '2rem' }}>
            With SecureX APIs, agents decide when to quarantine endpoints, block domains, or disable accounts (human-in-loop).
          </p>

          {/* Key Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <Shield style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>SecureX Integration</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <User style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>Human-in-Loop</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <Zap style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>Automated Response</span>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black', marginBottom: '1.5rem' }}>
            Recent Automated Actions
          </h2>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {actions.map((action) => {
              const ActionIcon = getActionIcon(action.type)
              return (
                <div key={action.id} style={{ 
                  backgroundColor: '#f9fafb', 
                  borderRadius: '0.75rem', 
                  border: '1px solid #e5e7eb', 
                  padding: '1.5rem',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <ActionIcon style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'black' }}>
                          {action.title}
                        </h3>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '9999px', 
                          fontSize: '0.75rem', 
                          fontWeight: '600',
                          backgroundColor: '#1e40af',
                          color: 'white'
                        }}>
                          {action.type.toUpperCase()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.625', marginBottom: '1rem' }}>
                        {action.description}
                      </p>
                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Target style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Target: {action.target}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{action.timestamp}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Shield style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{action.confidence}% confidence</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        backgroundColor: getStatusColor(action.status),
                        color: 'white'
                      }}>
                        {action.status.replace('_', ' ').toUpperCase()}
                      </span>
                      {action.approved && (
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '9999px', 
                          fontSize: '0.75rem', 
                          fontWeight: '600',
                          backgroundColor: '#16a34a',
                          color: 'white'
                        }}>
                          APPROVED
                        </span>
                      )}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {action.status === 'pending' && (
                          <>
                            <button style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.5rem', 
                              padding: '0.5rem 1rem', 
                              backgroundColor: '#16a34a', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '0.5rem', 
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s ease'
                            }}>
                              <CheckCircle style={{ height: '1rem', width: '1rem' }} />
                              Approve
                            </button>
                            <button style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.5rem', 
                              padding: '0.5rem 1rem', 
                              backgroundColor: '#dc2626', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '0.5rem', 
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s ease'
                            }}>
                              <XCircle style={{ height: '1rem', width: '1rem' }} />
                              Deny
                            </button>
                          </>
                        )}
                        {action.status === 'requires_approval' && (
                          <button style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            padding: '0.5rem 1rem', 
                            backgroundColor: '#dc2626', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '0.5rem', 
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease'
                          }}>
                            <AlertTriangle style={{ height: '1rem', width: '1rem' }} />
                            Review Required
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer Info */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280' }}>
            Automated responses are executed based on threat intelligence and risk assessment
          </p>
        </div>
      </div>
    </div>
  )
}