import { useState } from 'react'
import {Link, useLocation} from "react-router-dom";

export default function Menu() {

    return (
        <div className="flex min-h-screen items-center justify-center bg-[url('/grass.jpg')]">
            <h1 className="font-bold absolute top-0 text-8xl">QuestyCross</h1>
            <div className="rounded-2xl overflow-hidden w-[370px] border-black border-2 h-fit shadow-lg ">
                <Link to = "/game" className="buttonLink">
                    <button className="bg-black text-white w-full h-16 hover:bg-gray-600">Start</button>
                </Link>

                <button className="bg-black text-white w-full h-16 hover:bg-gray-600">Levels</button>
                <button className="bg-black text-white w-full h-16 hover:bg-gray-600">Shop</button>
                <button className="bg-black text-white w-full h-16 hover:bg-gray-600">Rules</button>
            </div>
        </div>
    )
}