import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { ThreatHunting } from './pages/ThreatHunting'
import { AlertTriage } from './pages/AlertTriage'
import { IncidentBuilder } from './pages/IncidentBuilder'
import { ResponseAutomation } from './pages/ResponseAutomation'
import { AnalystCopilot } from './pages/AnalystCopilot'
import { PredictiveDefense } from './pages/PredictiveDefense'
import { SREHealth } from './pages/SREHealth'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/automated-threat-hunting" element={<ThreatHunting />} />
        <Route path="/alert-triage" element={<AlertTriage />} />
        <Route path="/incident-case-builder" element={<IncidentBuilder />} />
        <Route path="/response-automation" element={<ResponseAutomation />} />
        <Route path="/analyst-copilot" element={<AnalystCopilot />} />
        <Route path="/predictive-defense" element={<PredictiveDefense />} />
        <Route path="/sre-health" element={<SREHealth />} />
      </Routes>
    </Layout>
  )
}

export default App
