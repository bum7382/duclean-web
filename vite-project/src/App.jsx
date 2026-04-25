import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import DevicesPage from './components/pages/DevicesPage.jsx'
import DeviceDetailPage from './components/pages/DeviceDetailPage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DevicesPage />} />
        <Route path="devices/:mac" element={<DeviceDetailPage />} />
      </Route>
    </Routes>
  )
}

export default App
