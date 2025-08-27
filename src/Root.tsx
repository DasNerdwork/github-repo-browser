import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import { Imprint } from "./pages/Imprint";
import { Privacy } from "./pages/Privacy";

const Root = () => (
    <Routes>
        <Route path="/" element={<App />} />
        <Route path="/imprint" element={<Imprint />} />
        <Route path="/privacy" element={<Privacy />} />
    </Routes>
);

export default Root;