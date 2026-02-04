import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import { ToastProvider } from "./contexts/ToastContext";
import RegulationIngestion from "./pages/RegulationIngestion";
import RegulationProvider from "./contexts/RegulationContext";
import ObligationReview from "./pages/ObligationReview";
import ObligationProvider from "./contexts/ObligationContext";
import MappingEditor from "./pages/MappingEditor";
import MappingProvider from "./contexts/MappingContext";
import ExecutionHistory from "./pages/ExecutionHistory";
import ExecutionProvider from "./contexts/ExecutionContext";
import Results from "./pages/Results";
import ResultsProvider from "./contexts/ResultsContext";
import AuditExpert from "./pages/AuditExpert";
import AuditExportProvider from "./contexts/AuditExportContext";

function App() {
  return (
    <BrowserRouter>
      <RegulationProvider>
        <ObligationProvider>
          <MappingProvider>
            <ExecutionProvider>
              <ResultsProvider>
                <AuditExportProvider>
                  <ToastProvider>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<RegulationIngestion />} />
                        <Route
                          path="/obligation-review"
                          element={<ObligationReview />}
                        />
                        <Route
                          path="/mapping-editor"
                          element={<MappingEditor />}
                        />
                        <Route
                          path="/execution-history"
                          element={<ExecutionHistory />}
                        />
                        <Route path="/results" element={<Results />} />
                        <Route path="/audit-export" element={<AuditExpert />} />
                      </Routes>
                    </Layout>
                  </ToastProvider>
                </AuditExportProvider>
              </ResultsProvider>
            </ExecutionProvider>
          </MappingProvider>
        </ObligationProvider>
      </RegulationProvider>
    </BrowserRouter>
  );
}

export default App;
