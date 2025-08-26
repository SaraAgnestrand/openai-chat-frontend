// src/App.tsx
import { HashRouter, Routes, Route } from "react-router-dom";
import * as s from "./app.css";
import { Header } from "./components/Header";
import Chat from "./components/Chat";
import History from "./components/History";
import Settings from "./components/Settings";
import NotFound from "./components/NotFound";
import { Home } from "./components/Home";

export default function App() {
  return (
    <HashRouter>
      <div className={s.container}>
        <Header
          onReset={() =>
            window.dispatchEvent(new CustomEvent("nextchat:reset"))
          }
          onExport={() =>
            window.dispatchEvent(new CustomEvent("nextchat:export"))
          }
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
