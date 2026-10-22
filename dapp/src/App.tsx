import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { RootLayout } from './layouts/RootLayout';
import { FarmerLayout } from './layouts/FarmerLayout';
import { FactoryLayout } from './layouts/FactoryLayout';
import { CustomsLayout } from './layouts/CustomsLayout';

// Pages
import { PortalHub } from './pages/PortalHub';

// Farmer Pages
import { FarmerLogin } from './pages/farmer/FarmerLogin';
import { FarmMapping } from './pages/farmer/FarmMapping';
import { BatchRegistration } from './pages/farmer/BatchRegistration';
import { BatchHistory } from './pages/farmer/BatchHistory';

// Factory Pages
import { FactoryDashboard } from './pages/factory/FactoryDashboard';
import { BatchManagement } from './pages/factory/BatchManagement';
import { ExportClearanceOCR } from './pages/factory/ExportClearanceOCR';

// Customs Pages
import { ScanAndSearch } from './pages/customs/ScanAndSearch';
import { SingleSourceOfTruth } from './pages/customs/SingleSourceOfTruth';
import { GreenChannelRelease } from './pages/customs/GreenChannelRelease';

// Go Backend (Port 4001) Core Modules
import { QuickRegister } from './pages/QuickRegister';
import { FactoryMerge } from './pages/FactoryMerge';
import { AiDashboard } from './pages/AiDashboard';
import { CustomsGreenChannel } from './pages/CustomsGreenChannel';
import { PublicTracking } from './pages/PublicTracking';

import { SeniorModeProvider } from './context/SeniorModeContext';

export default function App() {
  return (
    <SeniorModeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            {/* 0. Central Portal Hub & Launchpad */}
            <Route index element={<PortalHub />} />

            {/* The 5 LaoTrace Core Modules */}
            <Route path="register" element={<QuickRegister />} />
            <Route path="merge" element={<FactoryMerge />} />
            <Route path="ai-dashboard" element={<AiDashboard />} />
            <Route path="customs" element={<CustomsGreenChannel />} />
            <Route path="track" element={<PublicTracking />} />
            <Route path="track/:id" element={<PublicTracking />} />
            <Route path="track/:batch_id" element={<PublicTracking />} />

            {/* 1. Portal 1: Farmer & Middleman App (Mobile PWA Frame) */}
            <Route path="farmer" element={<FarmerLayout />}>
              <Route index element={<Navigate to="/farmer/register" replace />} />
              <Route path="login" element={<FarmerLogin />} />
              <Route path="map" element={<FarmMapping />} />
              <Route path="register" element={<BatchRegistration />} />
              <Route path="history" element={<BatchHistory />} />
            </Route>

            {/* 2. Portal 2: Factory & Exporter Portal (Desktop Dashboard) */}
            <Route path="factory" element={<FactoryLayout />}>
              <Route index element={<Navigate to="/factory/batches" replace />} />
              <Route path="dashboard" element={<FactoryDashboard />} />
              <Route path="batches" element={<BatchManagement />} />
              <Route path="ocr" element={<ExportClearanceOCR />} />
            </Route>

            {/* 3. Portal 3: Customs & Traceability Portal */}
            <Route path="customs" element={<CustomsLayout />}>
              <Route index element={<Navigate to="/customs/scan" replace />} />
              <Route path="scan" element={<ScanAndSearch />} />
              <Route path="trace/:batchId" element={<SingleSourceOfTruth />} />
              <Route path="release" element={<GreenChannelRelease />} />
            </Route>

            {/* Catch-all redirect to Hub */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </SeniorModeProvider>
  );
}
