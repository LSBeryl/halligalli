import { Route, Routes, BrowserRouter, Outlet } from "react-router-dom";

import Main from "./pages/Main";
import Play from "./pages/Play";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/play" element={<Play />} />
      </Routes>
    </BrowserRouter>
  );
}
