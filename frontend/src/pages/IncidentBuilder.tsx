import { FileText, Search, Target, Clock, Users, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

export function IncidentBuilder() {
  const incidents = [
    {
      id: 1,
      title: "Advanced Persistent Threat Investigation",
      description: "Multi-stage attack involving credential theft, lateral movement, and data exfiltration across multiple systems.",
      severity: "critical",
      status: "active",
      createdAt: "2 hours ago",
      evidence: [
        { id: 1, type: "Network Traffic", source: "Firewall Logs", relevance: "high", description: "Suspicious outbound connections to known C2 servers" },
        { id: 2, type: "File Analysis", source: "Endpoint Detection", relevance: "high", description: "Malware signature detected in downloaded files" },
        { id: 3, type: "User Activity", source: "Authentication Logs", relevance: "medium", description: "Unusual login patterns from external IPs" }
      ],
      mitreTags: ["T1078", "T1055", "T1041", "T1027"],
      affectedSystems: 15,
      confidence: 94
    },
    {
      id: 2,
      title: "Ransomware Deployment Attempt",
      description: "Attempted ransomware deployment with file encryption activities detected across multiple endpoints.",
      severity: "high",
      status: "investigating",
      createdAt: "4 hours ago",
      evidence: [
        { id: 1, type: "File System", source: "Endpoint Detection", relevance: "high", description: "Mass file encryption activity detected" },
        { id: 2, type: "Network Traffic", source: "Network Monitoring", relevance: "medium", description: "Communication with known ransomware infrastructure" }
      ],
      mitreTags: ["T1486", "T1055", "T1027"],
      affectedSystems: 8,
      confidence: 87
    },
    {
      id: 3,
      title: "Insider Threat Investigation",
      description: "Suspicious data access patterns and bulk file transfers outside normal business hours.",
      severity: "medium",
      status: "reviewing",
      createdAt: "1 day ago",
      evidence: [
        { id: 1, type: "User Activity", source: "Access Logs", relevance: "medium", description: "Unusual data access patterns during off-hours" },
        { id: 2, type: "File Transfer", source: "Network Monitoring", relevance: "medium", description: "Large volume data transfers to external services" }
      ],
      mitreTags: ["T1074", "T1041", "T1059"],
      affectedSystems: 3,
      confidence: 72
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
      case 'active': return '#dc2626'
      case 'investigating': return '#d97706'
      case 'reviewing': return '#2563eb'
      case 'resolved': return '#16a34a'
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
                <FileText style={{ height: '1.25rem', width: '1.25rem', color: 'white' }} />
              </div>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <h1 style={{ 
                  fontSize: '1.875rem', 
                  fontWeight: 'bold', 
                  color: 'black', 
                  cursor: 'pointer', 
                  transition: 'color 0.2s ease'
                }}>
                  Incident Case Builder
                </h1>
              </Link>
            </div>
          </div>
          
          {/* Cisco blue separator line */}
          <div style={{ height: '0.25rem', backgroundColor: '#1e40af', borderRadius: '9999px', marginBottom: '2rem' }}></div>

          {/* Description */}
          <p style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: '1.625', marginBottom: '2rem' }}>
            Agents pull related logs, enrich with intel, and generate structured case reports with MITRE tags.
          </p>

          {/* Key Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <Search style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>Log Correlation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <Target style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>MITRE Mapping</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <FileText style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>Structured Reports</span>
            </div>
          </div>
        </div>

        {/* Incidents Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black', marginBottom: '1.5rem' }}>
            Active Incident Cases
          </h2>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {incidents.map((incident) => (
              <div key={incident.id} style={{ 
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
                        {incident.title}
                      </h3>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        backgroundColor: getSeverityColor(incident.severity),
                        color: 'white'
                      }}>
                        {incident.severity.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.625', marginBottom: '1rem' }}>
                      {incident.description}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{incident.createdAt}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{incident.affectedSystems} systems</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Target style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{incident.confidence}% confidence</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                      {incident.mitreTags.map((tag, index) => (
                        <span key={index} style={{ 
                          padding: '0.25rem 0.5rem', 
                          backgroundColor: '#1e40af', 
                          color: 'white', 
                          borderRadius: '0.25rem', 
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                        Evidence ({incident.evidence.length} items):
                      </h4>
                      <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {incident.evidence.map((evidence) => (
                          <div key={evidence.id} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            padding: '0.5rem', 
                            backgroundColor: 'white', 
                            borderRadius: '0.25rem',
                            border: '1px solid #e5e7eb'
                          }}>
                            <div style={{ 
                              width: '0.5rem', 
                              height: '0.5rem', 
                              borderRadius: '50%', 
                              backgroundColor: evidence.relevance === 'high' ? '#dc2626' : evidence.relevance === 'medium' ? '#d97706' : '#16a34a'
                            }}></div>
                            <span style={{ fontSize: '0.75rem', color: '#374151', fontWeight: '500' }}>
                              {evidence.type}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              - {evidence.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      backgroundColor: getStatusColor(incident.status),
                      color: 'white'
                    }}>
                      {incident.status.toUpperCase()}
                    </span>
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
                      View Case
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280' }}>
            AI agents automatically correlate evidence and generate comprehensive incident reports
          </p>
        </div>
      </div>
    </div>
  )
}