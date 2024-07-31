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
import { Box, CircularProgress } from "@mui/material";

// Lazy load LoginPage
const LoginPage = lazy(() => import("./pages/login"));

const App: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <Router>
      <Box>
        <Suspense fallback={<CircularProgress />}>
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/products" /> : <LoginPage />
              }
            />
            <Route
              path="/products"
              element={
                isAuthenticated ? (
                  <ProductsPage />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Suspense>
      </Box>
    </Router>
  );
};

export default App;
