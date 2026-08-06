import { Routes, Route } from "react-router-dom";
import Login from "./Pages/login";
import Register from "./Pages/register";
import Home from "./Pages/home";

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
    </Routes>
    </>
  );
}

export default App;