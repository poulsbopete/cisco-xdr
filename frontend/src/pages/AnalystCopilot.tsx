import { Bot, Search, FileText, Target, AlertTriangle, Clock, Users, Globe, Lock, CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AnalystCopilot() {
  const playbooks = [
    {
      id: 1,
      title: "Ransomware Response Playbook",
      description: "Comprehensive response procedures for ransomware incidents including isolation, assessment, and recovery steps.",
      category: "Incident Response",
      lastUpdated: "2 days ago",
      steps: 12,
      confidence: 95,
      tags: ["ransomware", "isolation", "recovery"]
    },
    {
      id: 2,
      title: "APT Investigation Workflow",
      description: "Advanced persistent threat investigation procedures with focus on lateral movement detection and attribution.",
      category: "Threat Hunting",
      lastUpdated: "1 week ago",
      steps: 18,
      confidence: 92,
      tags: ["apt", "lateral-movement", "attribution"]
    },
    {
      id: 3,
      title: "Insider Threat Assessment",
      description: "Procedures for identifying and investigating potential insider threats including behavioral analysis.",
      category: "Insider Threat",
      lastUpdated: "3 days ago",
      steps: 8,
      confidence: 88,
      tags: ["insider-threat", "behavioral-analysis", "access-patterns"]
    }
  ]

  const suggestions = [
    {
      id: 1,
      title: "Check for similar incidents in the last 30 days",
      description: "Based on the current threat indicators, there have been 3 similar incidents in the past month.",
      action: "View Similar Incidents",
      confidence: 87,
      type: "investigation"
    },
    {
      id: 2,
      title: "Apply network isolation to affected endpoints",
      description: "Recommended immediate action to prevent lateral movement based on current threat indicators.",
      action: "Execute Isolation",
      confidence: 94,
      type: "response"
    },
    {
      id: 3,
      title: "Review authentication logs for compromised accounts",
      description: "Check for unusual login patterns that might indicate credential compromise.",
      action: "Review Logs",
      confidence: 76,
      type: "investigation"
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'response': return '#dc2626'
      case 'investigation': return '#2563eb'
      case 'prevention': return '#16a34a'
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
                <Bot style={{ height: '1.25rem', width: '1.25rem', color: 'white' }} />
              </div>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <h1 style={{ 
                  fontSize: '1.875rem', 
                  fontWeight: 'bold', 
                  color: 'black', 
                  cursor: 'pointer', 
                  transition: 'color 0.2s ease'
                }}>
                  Analyst Copilot
                </h1>
              </Link>
            </div>
          </div>
          
          {/* Cisco blue separator line */}
          <div style={{ height: '0.25rem', backgroundColor: '#1e40af', borderRadius: '9999px', marginBottom: '2rem' }}></div>

          {/* Description */}
          <p style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: '1.625', marginBottom: '2rem' }}>
            Vector search + AI retrieves Cisco/Elastic playbooks, past incidents, and suggests next best actions.
          </p>

          {/* Key Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <Search style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>Vector Search</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <FileText style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>Playbook Retrieval</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <Bot style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>AI Suggestions</span>
            </div>
          </div>
        </div>

        {/* Playbooks Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black', marginBottom: '1.5rem' }}>
            Recommended Playbooks
          </h2>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {playbooks.map((playbook) => (
              <div key={playbook.id} style={{ 
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
                        {playbook.title}
                      </h3>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        backgroundColor: '#1e40af',
                        color: 'white'
                      }}>
                        {playbook.category}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.625', marginBottom: '1rem' }}>
                      {playbook.description}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{playbook.lastUpdated}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{playbook.steps} steps</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Target style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{playbook.confidence}% match</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                      {playbook.tags.map((tag, index) => (
                        <span key={index} style={{ 
                          padding: '0.25rem 0.5rem', 
                          backgroundColor: '#e5e7eb', 
                          color: '#374151', 
                          borderRadius: '0.25rem', 
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
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
                      View Playbook
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestions Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black', marginBottom: '1.5rem' }}>
            AI-Powered Suggestions
          </h2>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} style={{ 
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
                        {suggestion.title}
                      </h3>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        backgroundColor: getTypeColor(suggestion.type),
                        color: 'white'
                      }}>
                        {suggestion.type.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.625', marginBottom: '1rem' }}>
                      {suggestion.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Target style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{suggestion.confidence}% confidence</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
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
                      {suggestion.action}
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
            AI continuously learns from past incidents to provide better recommendations
          </p>
        </div>
      </div>
    </div>
  )
}