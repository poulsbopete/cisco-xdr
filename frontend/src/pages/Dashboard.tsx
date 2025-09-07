import { Brain, Zap, Activity, Target, Bot, FileText, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Dashboard() {

  const useCases = [
    {
      id: 1,
      title: "Automated Threat Hunting",
      description: "LLM agents auto-correlate Cisco XDR alerts in Elastic, build attack timelines, and summarize into 'threat stories.'",
      icon: Brain,
      href: "/automated-threat-hunting"
    },
    {
      id: 2,
      title: "Response Automation",
      description: "With SecureX APIs, agents decide when to quarantine endpoints, block domains, or disable accounts (human-in-loop).",
      icon: Zap,
      href: "/response-automation"
    },
    {
      id: 3,
      title: "SRE Overall Health",
      description: "OTel O11Y with AI assistant with full agentic workflows",
      icon: Activity,
      href: "/sre-health"
    },
    {
      id: 4,
      title: "Alert Triage",
      description: "AI reduces noise by auto-closing low-confidence alerts, escalating high-confidence ones with context.",
      icon: Target,
      href: "/alert-triage"
    },
    {
      id: 5,
      title: "Analyst Copilot",
      description: "Vector search + AI retrieves Cisco/Elastic playbooks, past incidents, and suggests next best actions.",
      icon: Bot,
      href: "/analyst-copilot"
    },
    {
      id: 6,
      title: "Incident Case Builder",
      description: "Agents pull related logs, enrich with intel, and generate structured case reports with MITRE tags.",
      icon: FileText,
      href: "/incident-case-builder"
    },
    {
      id: 7,
      title: "Predictive Defense",
      description: "Elastic ML forecasts attacks; agents pre-stage defensive controls in XDR.",
      icon: TrendingUp,
      href: "/predictive-defense"
    }
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Main Container */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem' }}>
        {/* Demo Use Cases Section */}
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
                  Cisco XDR Use Cases
                </h1>
              </Link>
            </div>
          </div>
          
          {/* Cisco blue separator line */}
          <div style={{ height: '0.25rem', backgroundColor: '#1e40af', borderRadius: '9999px', marginBottom: '2rem' }}></div>

          {/* Use Cases Grid - 2 rows, 3 columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Row 1 */}
            <Link to={useCases[0].href} style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                              <div style={{ width: '3rem', height: '3rem', backgroundColor: '#1e40af', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Brain style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.5rem' }}>
                      {useCases[0].title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.625' }}>
                      {useCases[0].description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link to={useCases[1].href} style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                              <div style={{ width: '3rem', height: '3rem', backgroundColor: '#1e40af', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Zap style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.5rem' }}>
                      {useCases[1].title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.625' }}>
                      {useCases[1].description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link to={useCases[2].href} style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                              <div style={{ width: '3rem', height: '3rem', backgroundColor: '#1e40af', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Activity style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.5rem' }}>
                      {useCases[2].title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.625' }}>
                      {useCases[2].description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Row 2 */}
            <Link to={useCases[3].href} style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                              <div style={{ width: '3rem', height: '3rem', backgroundColor: '#1e40af', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Target style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.5rem' }}>
                      {useCases[3].title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.625' }}>
                      {useCases[3].description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link to={useCases[4].href} style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                              <div style={{ width: '3rem', height: '3rem', backgroundColor: '#1e40af', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.5rem' }}>
                      {useCases[4].title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.625' }}>
                      {useCases[4].description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link to={useCases[5].href} style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                              <div style={{ width: '3rem', height: '3rem', backgroundColor: '#1e40af', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.5rem' }}>
                      {useCases[5].title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.625' }}>
                      {useCases[5].description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Additional row for the 7th use case */}
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <Link to={useCases[6].href} style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s ease', maxWidth: '28rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                              <div style={{ width: '3rem', height: '3rem', backgroundColor: '#1e40af', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TrendingUp style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.5rem' }}>
                      {useCases[6].title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.625' }}>
                      {useCases[6].description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280' }}>
            Click on any solution above to explore detailed capabilities and interactive demos
          </p>
        </div>
      </div>
    </div>
  )
}