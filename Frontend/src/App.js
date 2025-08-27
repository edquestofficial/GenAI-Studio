import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import Footer from "./Footer";
import Detail from "./Detail";

function App() {
  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "10px"
      }}
    >
      <Header />
      <div
        className="flex w-full"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div className="w-100%">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/detail" element={<Detail />} />
            </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
