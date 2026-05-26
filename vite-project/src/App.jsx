import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import DevicesPage from './components/pages/DevicesPage.jsx'
import DeviceDetailPage from './components/pages/DeviceDetailPage.jsx'
import BackupsPage from './components/pages/BackupsPage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DevicesPage />} />
        <Route path="devices/:mac" element={<DeviceDetailPage />} />
        <Route path="backups" element={<BackupsPage />} />
      </Route>
    </Routes>
  )
}

export default App
