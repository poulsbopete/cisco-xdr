import { Brain, Search, Target, Clock, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export function ThreatHunting() {
  // Chart data
  const threatTimelineData = [
    { time: '00:00', alerts: 12, correlations: 3, stories: 1 },
    { time: '04:00', alerts: 8, correlations: 2, stories: 0 },
    { time: '08:00', alerts: 25, correlations: 8, stories: 2 },
    { time: '12:00', alerts: 18, correlations: 5, stories: 1 },
    { time: '16:00', alerts: 22, correlations: 7, stories: 2 },
    { time: '20:00', alerts: 15, correlations: 4, stories: 1 },
    { time: '24:00', alerts: 10, correlations: 2, stories: 0 }
  ]

  const mitreTechniquesData = [
    { technique: 'T1078', count: 15, severity: 'High', description: 'Valid Accounts' },
    { technique: 'T1055', count: 12, severity: 'High', description: 'Process Injection' },
    { technique: 'T1041', count: 8, severity: 'Medium', description: 'Exfiltration Over C2' },
    { technique: 'T1027', count: 6, severity: 'Medium', description: 'Obfuscated Files' },
    { technique: 'T1486', count: 4, severity: 'Critical', description: 'Data Encrypted' },
    { technique: 'T1074', count: 3, severity: 'Low', description: 'Data Staged' }
  ]

  const threatStories = [
    {
      id: 1,
      title: "Advanced Persistent Threat Campaign",
      description: "Multi-stage attack involving credential theft, lateral movement, and data exfiltration detected across 15 endpoints.",
      severity: "critical",
      confidence: 95,
      timeline: "2 hours",
      mitreTags: ["T1078", "T1055", "T1041"],
      status: "active"
    },
    {
      id: 2,
      title: "Ransomware Deployment Attempt",
      description: "Suspicious file encryption activity detected with known ransomware signatures and command patterns.",
      severity: "high",
      confidence: 88,
      timeline: "45 minutes",
      mitreTags: ["T1486", "T1055", "T1027"],
      status: "investigating"
    },
    {
      id: 3,
      title: "Insider Threat Activity",
      description: "Unusual data access patterns and bulk file transfers outside normal business hours detected.",
      severity: "medium",
      confidence: 72,
      timeline: "3 days",
      mitreTags: ["T1074", "T1041", "T1059"],
      status: "investigating"
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
                <Brain style={{ height: '1.25rem', width: '1.25rem', color: 'white' }} />
              </div>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <h1 style={{ 
                  fontSize: '1.875rem', 
                  fontWeight: 'bold', 
                  color: 'black', 
                  cursor: 'pointer', 
                  transition: 'color 0.2s ease'
                }}>
                  Automated Threat Hunting
                </h1>
              </Link>
            </div>
          </div>
          
          {/* Cisco blue separator line */}
          <div style={{ height: '0.25rem', backgroundColor: '#1e40af', borderRadius: '9999px', marginBottom: '2rem' }}></div>

          {/* Description */}
          <p style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: '1.625', marginBottom: '2rem' }}>
            LLM agents auto-correlate Cisco XDR alerts in Elastic, build attack timelines, and summarize into 'threat stories.'
          </p>

          {/* Key Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <Search style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>Real-time Correlation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <Target style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>MITRE ATT&CK Mapping</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <Brain style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>AI-Powered Analysis</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black', marginBottom: '1.5rem' }}>
            Threat Hunting Analytics
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            {/* Threat Timeline Chart */}
            <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'black', marginBottom: '1rem' }}>
                24-Hour Threat Activity Timeline
              </h3>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={threatTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="alerts" 
                      stroke="#dc2626" 
                      strokeWidth={3}
                      dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                      name="Alerts"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="correlations" 
                      stroke="#1e40af" 
                      strokeWidth={3}
                      dot={{ fill: '#1e40af', strokeWidth: 2, r: 4 }}
                      name="Correlations"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="stories" 
                      stroke="#16a34a" 
                      strokeWidth={3}
                      dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                      name="Threat Stories"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* MITRE Techniques Chart */}
            <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'black', marginBottom: '1rem' }}>
                Top MITRE ATT&CK Techniques
              </h3>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mitreTechniquesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="technique" 
                      stroke="#6b7280" 
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value, _, props) => {
                        const item = mitreTechniquesData.find(d => d.technique === props.payload.technique);
                        return [`${value} occurrences`, item?.description || 'Unknown'];
                      }}
                      labelFormatter={(label) => `Technique: ${label}`}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#1e40af"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
                {mitreTechniquesData.map((item, index) => (
                  <div key={index} style={{ 
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
                      backgroundColor: item.severity === 'Critical' ? '#dc2626' : 
                                      item.severity === 'High' ? '#ea580c' : 
                                      item.severity === 'Medium' ? '#d97706' : '#16a34a'
                    }}></div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.75rem', color: '#374151', fontWeight: '600' }}>
                        {item.technique}: {item.count}
                      </span>
                      <span style={{ fontSize: '0.625rem', color: '#6b7280' }}>
                        {item.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Threat Stories Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black', marginBottom: '1.5rem' }}>
            Active Threat Stories
          </h2>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {threatStories.map((story) => (
              <div key={story.id} style={{ 
                backgroundColor: '#f9fafb', 
                borderRadius: '0.75rem', 
                border: '1px solid #e5e7eb', 
                padding: '1.5rem',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'black' }}>
                        {story.title}
                      </h3>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        backgroundColor: getSeverityColor(story.severity),
                        color: 'white'
                      }}>
                        {story.severity.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.625', marginBottom: '1rem' }}>
                      {story.description}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{story.timeline}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Target style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{story.confidence}% confidence</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                      {story.mitreTags.map((tag, index) => (
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
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      backgroundColor: getStatusColor(story.status),
                      color: 'white'
                    }}>
                      {story.status}
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
                      Investigate
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
            Click on any threat story above to explore detailed analysis and investigation workflows
          </p>
        </div>
      </div>
    </div>
  )
}