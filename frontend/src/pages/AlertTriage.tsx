import { Target, CheckCircle, XCircle, Filter, TrendingUp, Clock, Shield, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AlertTriage() {
  const alerts = [
    {
      id: 1,
      title: "Suspicious PowerShell Execution",
      description: "PowerShell script execution detected with obfuscated commands and network connections to suspicious domains.",
      severity: "high",
      confidence: 87,
      source: "Endpoint Detection",
      timestamp: "2 minutes ago",
      status: "pending",
      falsePositive: false
    },
    {
      id: 2,
      title: "Failed Login Attempts",
      description: "Multiple failed login attempts detected from external IP addresses targeting admin accounts.",
      severity: "medium",
      confidence: 65,
      source: "Authentication Logs",
      timestamp: "15 minutes ago",
      status: "auto-closed",
      falsePositive: true
    },
    {
      id: 3,
      title: "Data Exfiltration Attempt",
      description: "Large volume of data transfer detected to external cloud storage services outside business hours.",
      severity: "critical",
      confidence: 94,
      source: "Network Monitoring",
      timestamp: "1 hour ago",
      status: "escalated",
      falsePositive: false
    },
    {
      id: 4,
      title: "Malware Signature Detected",
      description: "Known malware signature detected in file download from external source.",
      severity: "high",
      confidence: 92,
      source: "File Analysis",
      timestamp: "3 hours ago",
      status: "investigating",
      falsePositive: false
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626'
      case 'high': return '#ea580c'
      case 'medium': return '#d97706'
      case 'low': return '#16a34a'
      default: return '#6b7280'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#d97706'
      case 'escalated': return '#dc2626'
      case 'investigating': return '#2563eb'
      case 'auto-closed': return '#16a34a'
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
                <Target style={{ height: '1.25rem', width: '1.25rem', color: 'white' }} />
              </div>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <h1 style={{ 
                  fontSize: '1.875rem', 
                  fontWeight: 'bold', 
                  color: 'black', 
                  cursor: 'pointer', 
                  transition: 'color 0.2s ease'
                }}>
                  Alert Triage
                </h1>
              </Link>
            </div>
          </div>
          
          {/* Cisco blue separator line */}
          <div style={{ height: '0.25rem', backgroundColor: '#1e40af', borderRadius: '9999px', marginBottom: '2rem' }}></div>

          {/* Description */}
          <p style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: '1.625', marginBottom: '2rem' }}>
            AI reduces noise by auto-closing low-confidence alerts, escalating high-confidence ones with context.
          </p>

          {/* Key Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <Filter style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>Smart Filtering</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <TrendingUp style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>Confidence Scoring</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <Zap style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>Auto-Escalation</span>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black', marginBottom: '1.5rem' }}>
            Recent Alerts
          </h2>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {alerts.map((alert) => (
              <div key={alert.id} style={{ 
                backgroundColor: '#f9fafb', 
                borderRadius: '0.75rem', 
                border: '1px solid #e5e7eb', 
                padding: '1.5rem',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'black' }}>
                        {alert.title}
                      </h3>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        backgroundColor: getSeverityColor(alert.severity),
                        color: 'white'
                      }}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.625', marginBottom: '1rem' }}>
                      {alert.description}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{alert.timestamp}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Shield style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{alert.source}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Target style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{alert.confidence}% confidence</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      backgroundColor: getStatusColor(alert.status),
                      color: 'white'
                    }}>
                      {alert.status.replace('-', ' ').toUpperCase()}
                    </span>
                    {alert.falsePositive && (
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        backgroundColor: '#16a34a',
                        color: 'white'
                      }}>
                        FALSE POSITIVE
                      </span>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {alert.status === 'pending' && (
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
                            Dismiss
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280' }}>
            AI automatically triages alerts based on confidence scores and historical patterns
          </p>
        </div>
      </div>
    </div>
  )
}