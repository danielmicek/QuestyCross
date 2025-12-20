import {useEffect, useState} from 'react'
import {Link, useLocation} from "react-router-dom";
import { motion } from "motion/react"

import figuresFromJsonFile from "../../data/figures.json"
import abilitiesFromJsonFile from "../../data/abilities.json"
import levelsFromJsonFile from "../../data/levels.json"

function popupVisibilityHandler(setIsStartPopupVisible, setIsMenuVisible){
    setIsStartPopupVisible(prev => !prev);
    setIsMenuVisible(prev => !prev)
}

function shuffleLevels(levelsData) {
    const easy = levelsData.filter(level => level.difficulty === "easy");
    const medium = levelsData.filter(level => level.difficulty === "medium");
    const hard = levelsData.filter(level => level.difficulty === "hard");

}

export default function Menu() {
    const [isStartPopupVisible, setIsStartPopupVisible] = useState(false)
    const [isMenuVisible, setIsMenuVisible] = useState(true)
    const [coins, setCoins] = useState(parseInt(localStorage.getItem("coins")) || 1000)
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches; // zistime, ci sme na dotykovom zariadeni alebo pc

    const levelsData = levelsFromJsonFile;
    console.log(levelsData);


    useEffect(() => { // ulozenie figures.json do localStorage
        if(localStorage.getItem("figures") === null) localStorage.setItem("figures", JSON.stringify(figuresFromJsonFile));
    }, []);
    useEffect(() => { // ulozenie abilities.json do localStorage
        if(localStorage.getItem("abilities") === null) localStorage.setItem("abilities", JSON.stringify(abilitiesFromJsonFile));
    }, []);
    useEffect(() => { // ulozenie coins do localStorage
        localStorage.setItem("coins", coins.toString());
    }, [coins]);
    useEffect(() => { // ulozenie levelov do localStorage
        localStorage.setItem("levels", JSON.stringify(levelsFromJsonFile));
    }, []);
    const [levels, setLevels] = useState(JSON.parse(localStorage.getItem("levels")))

    return (
        <div className="flex min-h-screen items-center justify-center bg-[url('/grass.jpg')]">
            {/*<video src="/grass_loop.mp4"
                   autoPlay loop muted
                   className="absolute inset-0 w-full h-full object-cover">
            </video>*/}
            <motion.h1 initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.3}}}
                       className="font-bold absolute top-0 md:text-8xl text-6xl mt-10 text-shadow-lg">QuestyCross
            </motion.h1>

            {isStartPopupVisible &&
                <motion.div id="START_GAME_POPUP" initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.3}}}
                            className="border-2 absolute rounded-2xl w-[370px] overflow-hidden z-999">
                    <div>
                        <h3 className="font-bold text-2xl text-center bg-yellow-300 p-2 "> Ready to start the game?</h3>
                        <div>
                            <Link to="/game" className="buttonLink">
                                <motion.button id="YES_BUTTON"
                                               className="bg-black font-bold text-white w-full h-16 hover:bg-gray-600 border-b-yellow-300 border-b-2"
                                               onClick={() => popupVisibilityHandler(setIsStartPopupVisible, setIsMenuVisible)}>Yes
                                </motion.button>
                            </Link>

                            <motion.button id="NO_BUTTON"
                                           className="bg-black font-bold text-white w-full h-16 hover:bg-gray-600"
                                           onClick={() => popupVisibilityHandler(setIsStartPopupVisible, setIsMenuVisible)}>No
                            </motion.button>
                        </div>
                    </div>

                </motion.div>}

            {isMenuVisible &&
                <motion.div id="MENU" initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.3}}}
                            className="rounded-2xl overflow-hidden w-[370px]  h-fit  border-yellow-300 border-3 shadow-2xl z-999">

                    <button className="bg-black text-white w-full h-16 hover:bg-gray-600 border-b-yellow-300 border-b-2"
                            onClick={() => {
                                setIsStartPopupVisible(prev => !prev);
                                setIsMenuVisible(prev => !prev)
                            }}>Play
                    </button>
                    <button
                        className="bg-black text-white w-full h-16 hover:bg-gray-600 border-b-yellow-300 border-b-2">Levels
                    </button>

                    <Link to="/shop" className="buttonLink">
                        <button
                            className="bg-black text-white w-full h-16 hover:bg-gray-600 border-b-yellow-300 border-b-2">Shop
                        </button>
                    </Link>
                    <button className="bg-black text-white w-full h-16 hover:bg-gray-600">Rules</button>
                </motion.div>}
        </div>
    )
}