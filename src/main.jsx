import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


import Dashboard from './screens/Dashboard.jsx';
import TextModeration from './screens/TextModeration.jsx';
import TextModerationOutput from './screens/TextModerationOutput.jsx';
import FileUploadPage from './screens/FileUploadPage.jsx';
import MultimediaOutput from './screens/MultimediaModerationOutput.jsx';
import ImageModerationOutput from './screens/ImageModerationOutput.jsx';
import Login from './screens/Login.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import RegisterPage from './screens/Register.jsx';
import Profile from './screens/Profile.jsx';
import ForgetPage from './screens/ForgetPage.jsx';
import TextFileModerationOutput from './screens/TextFileOutput.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <RequireAuth><Dashboard /></RequireAuth>,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/profile",
    element: <RequireAuth><Profile /></RequireAuth>
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/forget",
    element: <ForgetPage />
  },
  {
    path: "/text",
    element: <RequireAuth><TextModeration /></RequireAuth>
  },
  {
    path: "/text-output",
    element: <RequireAuth><TextModerationOutput /></RequireAuth>
  },
  {
    path: "/textfile-output",
    element: <RequireAuth><TextFileModerationOutput /></RequireAuth>
  },
  {
    path: "/upload",
    element: <RequireAuth><FileUploadPage /></RequireAuth>
  },
  {
    path: "/multimedia-output",
    element: <RequireAuth><MultimediaOutput /></RequireAuth>
  },
  {
    path: "/image-output",
    element: <RequireAuth><ImageModerationOutput /></RequireAuth>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
