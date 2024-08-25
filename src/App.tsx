import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, LinearProgress } from "@mui/material";
import ProductsPage from "./pages/products";
import Profile from "./pages/profile";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundPage from "./pages/pageNotFound";

const LoginPage = lazy(() => import("./pages/login"));
const Dashboard = lazy(() => import("./pages/dashboard"));

const App: React.FC = () => {
  return (
    <Router>
      <Box>
        <Suspense fallback={<LinearProgress />}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </Box>
    </Router>
  );
};

export default App;
