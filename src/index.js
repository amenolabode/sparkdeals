import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { paths } from "./utils/routes";
import DealsPage from "./deals_page";
import AdminPage from "./admin_page";
require("dotenv").config();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <Routes>
        <Route path={paths.HOME} element={<DealsPage />} />
        <Route path={paths.ADMIN} element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
