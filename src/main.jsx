import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, Outlet, RouterProvider} from 'react-router-dom';
import Menu from "./pages/Menu.jsx";
import GameBoard from "./pages/GameBoard.jsx";

const router = createBrowserRouter([
        {
            path: '/',
            element: <Menu/>,
        },
        {
            path: '/game',
            element: <GameBoard/>,
        }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider  router={router}/>
  </StrictMode>,
)
