import { Activity, Server, Users, CheckCircle, ExternalLink, AlertTriangle, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export function SREHealth() {
  const services = [
    {
      id: 1,
      name: "API Gateway",
      status: "healthy",
      uptime: "99.9%",
      responseTime: "45ms",
      requests: "12.5K/min",
      lastIncident: "3 days ago",
      healthScore: 98
    },
    {
      id: 2,
      name: "Database Cluster",
      status: "degraded",
      uptime: "99.2%",
      responseTime: "120ms",
      requests: "8.2K/min",
      lastIncident: "1 hour ago",
      healthScore: 85
    },
    {
      id: 3,
      name: "Cache Layer",
      status: "healthy",
      uptime: "99.8%",
      responseTime: "12ms",
      requests: "25.1K/min",
      lastIncident: "1 week ago",
      healthScore: 96
    },
    {
      id: 4,
      name: "Message Queue",
      status: "warning",
      uptime: "98.9%",
      responseTime: "85ms",
      requests: "5.8K/min",
      lastIncident: "6 hours ago",
      healthScore: 78
    }
  ]

  const aiActions = [
    {
      id: 1,
      title: "Auto-scaling Database Connections",
      description: "Automatically increased database connection pool size to handle increased load.",
      action: "completed",
      timestamp: "5 minutes ago",
      impact: "positive",
      confidence: 94
    },
    {
      id: 2,
      title: "Cache Warming Strategy",
      description: "Pre-warmed frequently accessed data in cache to improve response times.",
      action: "completed",
      timestamp: "15 minutes ago",
      impact: "positive",
      confidence: 89
    },
    {
      id: 3,
      title: "Message Queue Optimization",
      description: "Recommended message queue configuration changes to reduce latency.",
      action: "pending",
      timestamp: "1 hour ago",
      impact: "neutral",
      confidence: 76
    },
    {
      id: 4,
      title: "Load Balancer Adjustment",
      description: "Suggested load balancer weight adjustments based on service performance.",
      action: "recommended",
      timestamp: "2 hours ago",
      impact: "positive",
      confidence: 82
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#16a34a'
      case 'degraded': return '#d97706'
      case 'warning': return '#ea580c'
      case 'critical': return '#dc2626'
      default: return '#6b7280'
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'completed': return '#16a34a'
      case 'pending': return '#d97706'
      case 'recommended': return '#2563eb'
      case 'failed': return '#dc2626'
      default: return '#6b7280'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return '#16a34a'
      case 'neutral': return '#6b7280'
      case 'negative': return '#dc2626'
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
                <Activity style={{ height: '1.25rem', width: '1.25rem', color: 'white' }} />
              </div>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <h1 style={{ 
                  fontSize: '1.875rem', 
                  fontWeight: 'bold', 
                  color: 'black', 
                  cursor: 'pointer', 
                  transition: 'color 0.2s ease'
                }}>
                  SRE Overall Health
                </h1>
              </Link>
            </div>
          </div>
          
          {/* Cisco blue separator line */}
          <div style={{ height: '0.25rem', backgroundColor: '#1e40af', borderRadius: '9999px', marginBottom: '2rem' }}></div>

          {/* Description */}
          <p style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: '1.625', marginBottom: '2rem' }}>
            OTel O11Y with AI assistant with full agentic workflows
          </p>

          {/* Key Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <Activity style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>OpenTelemetry</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <TrendingUp style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>AI Assistant</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <Server style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>Service Monitoring</span>
            </div>
          </div>
        </div>

        {/* Services Health Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black', marginBottom: '1.5rem' }}>
            Service Health Overview
          </h2>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {services.map((service) => (
              <div key={service.id} style={{ 
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
                        {service.name}
                      </h3>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        backgroundColor: getStatusColor(service.status),
                        color: 'white'
                      }}>
                        {service.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Uptime: {service.uptime}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Response: {service.responseTime}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Load: {service.requests}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertTriangle style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Last Incident: {service.lastIncident}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      padding: '0.5rem 1rem', 
                      backgroundColor: '#1e40af', 
                      color: 'white', 
                      borderRadius: '0.5rem', 
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      <span>Health Score: {service.healthScore}%</span>
                    </div>
                    <button style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      padding: '0.5rem 1rem', 
                      backgroundColor: '#1e40af', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '0.5rem', 
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}>
                      <ExternalLink style={{ height: '1rem', width: '1rem' }} />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Actions Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black', marginBottom: '1.5rem' }}>
            AI Assistant Actions
          </h2>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {aiActions.map((action) => (
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
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'black' }}>
                        {action.title}
                      </h3>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        backgroundColor: getActionColor(action.action),
                        color: 'white'
                      }}>
                        {action.action.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.625', marginBottom: '1rem' }}>
                      {action.description}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{action.timestamp}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{action.confidence}% confidence</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ 
                          width: '0.5rem', 
                          height: '0.5rem', 
                          borderRadius: '50%', 
                          backgroundColor: getImpactColor(action.impact)
                        }}></div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{action.impact} impact</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    {action.action === 'pending' && (
                      <button style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        padding: '0.5rem 1rem', 
                        backgroundColor: '#1e40af', 
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
                    )}
                    {action.action === 'recommended' && (
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
                        Implement
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280' }}>
            AI continuously monitors service health and automatically optimizes performance
          </p>
        </div>
      </div>
    </div>
  )
}