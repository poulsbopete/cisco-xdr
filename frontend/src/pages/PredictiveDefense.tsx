import { TrendingUp, Shield, Target, Clock, Users, CheckCircle, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

export function PredictiveDefense() {
  // Chart data
  const threatTrendData = [
    { time: '00:00', ransomware: 45, apt: 32, insider: 23 },
    { time: '04:00', ransomware: 52, apt: 28, insider: 20 },
    { time: '08:00', ransomware: 48, apt: 35, insider: 17 },
    { time: '12:00', ransomware: 61, apt: 29, insider: 10 },
    { time: '16:00', ransomware: 58, apt: 33, insider: 9 },
    { time: '20:00', ransomware: 55, apt: 30, insider: 15 },
    { time: '24:00', ransomware: 49, apt: 31, insider: 20 }
  ]

  const threatTypeData = [
    { name: 'Ransomware', value: 45, color: '#dc2626' },
    { name: 'APT', value: 30, color: '#ea580c' },
    { name: 'Insider Threat', value: 15, color: '#d97706' },
    { name: 'Malware', value: 10, color: '#16a34a' }
  ]

  const defensiveActionsData = [
    { action: 'Endpoint Protection', effectiveness: 95, cost: 85 },
    { action: 'Network Segmentation', effectiveness: 88, cost: 70 },
    { action: 'Monitoring Enhancement', effectiveness: 92, cost: 60 },
    { action: 'Access Controls', effectiveness: 85, cost: 45 },
    { action: 'Incident Response', effectiveness: 90, cost: 80 }
  ]

  const predictions = [
    {
      id: 1,
      title: "Ransomware Campaign Prediction",
      description: "High probability of ransomware attack targeting financial sector based on current threat landscape and attack patterns.",
      threatType: "Ransomware",
      probability: 87,
      timeframe: "Next 7 days",
      affectedSectors: ["Financial", "Healthcare", "Education"],
      indicators: [
        "Increased phishing activity",
        "Exploit kit deployment",
        "C2 infrastructure setup"
      ],
      status: "active",
      confidence: 92
    },
    {
      id: 2,
      title: "APT Group Activity Forecast",
      description: "Advanced persistent threat group expected to target critical infrastructure based on historical attack patterns.",
      threatType: "APT",
      probability: 74,
      timeframe: "Next 14 days",
      affectedSectors: ["Energy", "Manufacturing", "Government"],
      indicators: [
        "Reconnaissance activity",
        "Spear phishing campaigns",
        "Zero-day exploit preparation"
      ],
      status: "monitoring",
      confidence: 85
    },
    {
      id: 3,
      title: "Insider Threat Risk Assessment",
      description: "Elevated risk of insider threat activity based on behavioral analysis and access pattern anomalies.",
      threatType: "Insider Threat",
      probability: 63,
      timeframe: "Next 30 days",
      affectedSectors: ["Technology", "Finance"],
      indicators: [
        "Unusual data access patterns",
        "Off-hours system access",
        "Bulk data download attempts"
      ],
      status: "investigating",
      confidence: 78
    }
  ]

  const defensiveActions = [
    {
      id: 1,
      title: "Deploy Additional Endpoint Protection",
      description: "Pre-stage enhanced endpoint detection and response capabilities on high-risk systems.",
      actionType: "Prevention",
      priority: "High",
      estimatedTime: "2 hours",
      systemsAffected: 150,
      status: "ready"
    },
    {
      id: 2,
      title: "Update Firewall Rules",
      description: "Implement additional network segmentation and blocking rules for predicted attack vectors.",
      actionType: "Network Security",
      priority: "Medium",
      estimatedTime: "1 hour",
      systemsAffected: 25,
      status: "pending"
    },
    {
      id: 3,
      title: "Enhance Monitoring Coverage",
      description: "Increase logging and monitoring on critical systems and data repositories.",
      actionType: "Detection",
      priority: "High",
      estimatedTime: "4 hours",
      systemsAffected: 75,
      status: "ready"
    }
  ]

  const getThreatTypeColor = (type: string) => {
    switch (type) {
      case 'Ransomware': return '#dc2626'
      case 'APT': return '#ea580c'
      case 'Insider Threat': return '#d97706'
      case 'Malware': return '#16a34a'
      default: return '#6b7280'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#dc2626'
      case 'monitoring': return '#d97706'
      case 'investigating': return '#2563eb'
      case 'ready': return '#16a34a'
      case 'pending': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#dc2626'
      case 'Medium': return '#d97706'
      case 'Low': return '#16a34a'
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
                <TrendingUp style={{ height: '1.25rem', width: '1.25rem', color: 'white' }} />
              </div>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <h1 style={{ 
                  fontSize: '1.875rem', 
                  fontWeight: 'bold', 
                  color: 'black', 
                  cursor: 'pointer', 
                  transition: 'color 0.2s ease'
                }}>
                  Predictive Defense
                </h1>
              </Link>
            </div>
          </div>
          
          {/* Cisco blue separator line */}
          <div style={{ height: '0.25rem', backgroundColor: '#1e40af', borderRadius: '9999px', marginBottom: '2rem' }}></div>

          {/* Description */}
          <p style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: '1.625', marginBottom: '2rem' }}>
            Elastic ML forecasts attacks; agents pre-stage defensive controls in XDR.
          </p>

          {/* Key Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <TrendingUp style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>ML Forecasting</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <Shield style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>Pre-staged Controls</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <Target style={{ height: '1.25rem', width: '1.25rem', color: '#1e40af' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>Threat Intelligence</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black', marginBottom: '1.5rem' }}>
            Threat Intelligence Analytics
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            {/* Threat Trend Chart */}
            <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'black', marginBottom: '1rem' }}>
                24-Hour Threat Probability Trends
              </h3>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={threatTrendData}>
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
                      dataKey="ransomware" 
                      stroke="#dc2626" 
                      strokeWidth={3}
                      dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                      name="Ransomware"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="apt" 
                      stroke="#ea580c" 
                      strokeWidth={3}
                      dot={{ fill: '#ea580c', strokeWidth: 2, r: 4 }}
                      name="APT"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="insider" 
                      stroke="#d97706" 
                      strokeWidth={3}
                      dot={{ fill: '#d97706', strokeWidth: 2, r: 4 }}
                      name="Insider Threat"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Threat Type Distribution */}
            <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'black', marginBottom: '1rem' }}>
                Threat Type Distribution
              </h3>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={threatTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {threatTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
                {threatTypeData.map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ 
                      width: '0.75rem', 
                      height: '0.75rem', 
                      backgroundColor: item.color, 
                      borderRadius: '50%' 
                    }}></div>
                    <span style={{ fontSize: '0.75rem', color: '#374151' }}>
                      {item.name}: {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Defensive Actions Effectiveness */}
          <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'black', marginBottom: '1rem' }}>
              Defensive Actions Effectiveness vs Cost
            </h3>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={defensiveActionsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="action" 
                    stroke="#6b7280" 
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Bar 
                    dataKey="effectiveness" 
                    fill="#1e40af" 
                    name="Effectiveness %"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="cost" 
                    fill="#6b7280" 
                    name="Cost %"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Predictions Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black', marginBottom: '1.5rem' }}>
            Threat Predictions
          </h2>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {predictions.map((prediction) => (
              <div key={prediction.id} style={{ 
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
                        {prediction.title}
                      </h3>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        backgroundColor: getThreatTypeColor(prediction.threatType),
                        color: 'white'
                      }}>
                        {prediction.threatType}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.625', marginBottom: '1rem' }}>
                      {prediction.description}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{prediction.probability}% probability</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{prediction.timeframe}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Target style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{prediction.confidence}% confidence</span>
                      </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                        Affected Sectors: {prediction.affectedSectors.join(', ')}
                      </h4>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                        Key Indicators:
                      </h4>
                      <div style={{ display: 'grid', gap: '0.25rem' }}>
                        {prediction.indicators.map((indicator, index) => (
                          <div key={index} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            padding: '0.25rem 0.5rem', 
                            backgroundColor: 'white', 
                            borderRadius: '0.25rem',
                            border: '1px solid #e5e7eb'
                          }}>
                            <div style={{ 
                              width: '0.5rem', 
                              height: '0.5rem', 
                              borderRadius: '50%', 
                              backgroundColor: '#dc2626'
                            }}></div>
                            <span style={{ fontSize: '0.75rem', color: '#374151' }}>
                              {indicator}
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
                      backgroundColor: getStatusColor(prediction.status),
                      color: 'white'
                    }}>
                      {prediction.status.toUpperCase()}
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
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Defensive Actions Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black', marginBottom: '1.5rem' }}>
            Pre-staged Defensive Actions
          </h2>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {defensiveActions.map((action) => (
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
                        backgroundColor: '#1e40af',
                        color: 'white'
                      }}>
                        {action.actionType}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.625', marginBottom: '1rem' }}>
                      {action.description}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{action.estimatedTime}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{action.systemsAffected} systems</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Target style={{ height: '1rem', width: '1rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{action.priority} priority</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      backgroundColor: getPriorityColor(action.priority),
                      color: 'white'
                    }}>
                      {action.priority}
                    </span>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      backgroundColor: getStatusColor(action.status),
                      color: 'white'
                    }}>
                      {action.status.toUpperCase()}
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
                      <CheckCircle style={{ height: '1rem', width: '1rem' }} />
                      Execute
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
            ML models continuously analyze threat patterns to predict and prevent future attacks
          </p>
        </div>
      </div>
    </div>
  )
}