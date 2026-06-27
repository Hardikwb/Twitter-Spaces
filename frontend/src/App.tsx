import "./App.css";
import { Navigation } from "./components";
import { Outlet } from "react-router-dom";
import { useLoadingWithRefresh } from "./hooks/useLoadingWithRefresh";
import Loader from "./components/shared/Loader/Loader";
function App() {
  const { loading } = useLoadingWithRefresh();
  return (
    <>
      <div className="bg-[#121212] text-white ">
        <Navigation />
        {loading ? (
          <Loader message="Loading.. Please wait" />
        ) : (
          <main>
            <Outlet />
          </main>
        )}
      </div>
    </>
  );
}

export default App;
