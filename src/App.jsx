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

function App() {
  return (
    <BrowserRouter>
      <RegulationProvider>
        <ObligationProvider>
          <MappingProvider>
            <ToastProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<RegulationIngestion />} />
                  <Route
                    path="/obligation-review"
                    element={<ObligationReview />}
                  />
                  <Route path="/mapping-editor" element={<MappingEditor />} />
                </Routes>
              </Layout>
            </ToastProvider>
          </MappingProvider>
        </ObligationProvider>
      </RegulationProvider>
    </BrowserRouter>
  );
}

export default App;
