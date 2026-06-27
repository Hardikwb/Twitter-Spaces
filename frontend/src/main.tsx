import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home.tsx";
import Register from "./pages/Register/Register.tsx";
import Login from "./pages/Login/Login.tsx";
import Authenticate from "./pages/Authenticate/Authenticate.tsx";
import Rooms from "./pages/Rooms/Rooms.tsx";
import { Provider } from "react-redux";
import {
  GuestRoute,
  ProtectedRoute,
  SemiProtectedRoute,
} from "./components/AuthenticatedRoute.tsx";
import Activate from "./pages/Activate/Activate.tsx";
import store from "./store/store.ts";
import RoomPage from "./pages/RoomPage/RoomPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <GuestRoute>
            <Home />,
          </GuestRoute>
        ),
      },
      {
        path: "/authenticate",
        element: (
          <GuestRoute>
            <Authenticate />,
          </GuestRoute>
        ),
      },
      {
        path: "/activate",
        element: (
          <SemiProtectedRoute>
            <Activate />
          </SemiProtectedRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <GuestRoute>
            <Register />,
          </GuestRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <GuestRoute>
            <Login />,
          </GuestRoute>
        ),
      },
      {
        path: "/rooms",
        element: (
          <ProtectedRoute>
            <Rooms />,
          </ProtectedRoute>
        ),
      },
      {
        path: "/rooms/:roomid",
        element: (
          <ProtectedRoute>
            <RoomPage />,
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);

// <StrictMode>
// </StrictMode>,
