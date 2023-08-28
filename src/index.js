
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { paths } from "./utils/routes";
import DealsPage from "./deals_page";
import AdminPage from "./admin_page";
import Page404 from "./404";
import SignIn from "./auth/admin_signin";
// import { AuthDetails } from "./utils/firebase_config";
import { AuthContextProvider } from "./context/auth_context";
import ProtectedRoutes from "./components/protected_routes";
import SignUp from "./auth/admin_signup";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter basename="/">
        <Routes>
          <Route path={paths.HOME} element={<DealsPage />} />
          <Route path={paths.ADMIN} element={<ProtectedRoutes><AdminPage /></ProtectedRoutes>} />
          <Route path={paths.SIGININ} element={<SignIn />} />
          <Route path={paths.SIGNUP} element={<SignUp />} />

          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>

  </React.StrictMode>
);
