import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import ChartTool from './pages/tools/ChartTool';
import StatsTool from './pages/tools/StatsTool';
import MergeFiles from './pages/tools/MergeFiles';
import DataCleaning from './pages/tools/DataCleaning';
import FinanceCalc from './pages/tools/FinanceCalc';
import Team from './pages/Team';
import Auth from './pages/Auth';
import AIAssistant from './components/AIAssistant';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/*<Navbar />*/}
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/team" element={<Team />} />
              <Route path="/tools/chart" element={<ChartTool />} />
              <Route path="/tools/stats" element={<StatsTool />} />
              <Route path="/tools/merge" element={<MergeFiles />} />
              <Route path="/tools/clean" element={<DataCleaning />} />
              <Route path="/tools/finance" element={<FinanceCalc />} />
            </Routes>
          </main>
        </div>
        <AIAssistant />
      </div>
    </Router>
  );
}

export default App;