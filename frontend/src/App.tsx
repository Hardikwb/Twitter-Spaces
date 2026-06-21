import "./App.css";
import { Navigation } from "./components";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <>
      <div className="bg-[#121212] text-white ">
        <Navigation />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
