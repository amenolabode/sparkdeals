import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { paths } from "./utils/routes";
import DealsPage from "./deals_page";
import AdminPage from "./admin_page";
import Page404 from "./404";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <Routes>
        <Route path={paths.HOME} element={<DealsPage />} />
        <Route path={paths.ADMIN} element={<AdminPage />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
