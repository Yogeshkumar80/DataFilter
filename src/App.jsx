import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
// import Navbar from "./assets/Navbar/Navbar";
import Layout from "./assets/Main/Layout";
import Home from "./assets/Main/Home/Home";
function App() {
  return (
    <BrowserRouter>
      <Routes>
       <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>} />
       </Route>
       

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
