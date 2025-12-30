import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Menu from "./pages/Menu.jsx";
import GameBoard from "./pages/GameBoard.jsx";
import Shop from "./pages/Shop.jsx";

function getBasename() {
    const { pathname } = window.location;
    const cleanPath = pathname.replace(/\/+$/, "");
    const base = cleanPath.replace(/\/(game|shop).*$/, "");
    return base === "" ? "/" : base;
}

const basename = getBasename();

const router = createBrowserRouter(
    [
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
            ],
        {
                basename: basename,
            }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider  router={router}/>
  </StrictMode>,
)
