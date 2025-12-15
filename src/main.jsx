import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, Outlet, RouterProvider} from 'react-router-dom';
import Menu from "./pages/Menu.jsx";
import GameBoard from "./pages/GameBoard.jsx";
import Shop from "./pages/Shop.jsx";

const router = createBrowserRouter([
        {
            path: '/',
            element: <Menu/>,
        },
        {
            path: '/game',
            element: <GameBoard/>,
        },
    {
        path: '/shop',
        element: <Shop/>,
    }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider  router={router}/>
  </StrictMode>,
)
