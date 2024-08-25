import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import ProductsPage from "./pages/products";
import { Box, LinearProgress } from "@mui/material";
import Dashboard from "./pages/dashboard";
const LoginPage = lazy(() => import("./pages/login"));
const NotFoundPage = lazy(() => import("./pages/pageNotFound"));

const App: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <Router>
      <Box>
        <Suspense fallback={<LinearProgress />}>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? <Navigate to="/products" /> : <LoginPage />
              }
            />
            <Route
              path="/products"
              element={isAuthenticated ? <ProductsPage /> : <Navigate to="/" />}
            />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
            />
            <Route
              path="*"
              element={isAuthenticated ? <NotFoundPage /> : <LoginPage />}
            />
          </Routes>
        </Suspense>
      </Box>
    </Router>
  );
};

export default App;
