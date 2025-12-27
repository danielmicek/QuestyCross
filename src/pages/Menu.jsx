import React, {useEffect, useState} from 'react'
import {Link, useLocation} from "react-router-dom";
import { motion } from "motion/react"

import figuresFromJsonFile from "../../data/figures.json"
import abilitiesFromJsonFile from "../../data/abilities.json"
import levelsFromJsonFile from "../../data/levels.json"
import RulesModal from "../components/RulesModal.jsx";
import CommonModal from "../components/CommonModal.jsx";
import LevelsCarousel from "../components/LevelsCarousel.jsx";


function shuffleLevels(levelsData) {
    const easy = shuffle(levelsData.filter(level => level.difficulty === "easy"));
    const medium = shuffle(levelsData.filter(level => level.difficulty === "medium"));
    const hard = shuffle(levelsData.filter(level => level.difficulty === "hard"));
    return [...easy, ...medium, ...hard];
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export default function Menu() {
    const [isStartPopupVisible, setIsStartPopupVisible] = useState(false)
    const [isMenuVisible, setIsMenuVisible] = useState(true)
    const [coins] = useState(parseInt(localStorage.getItem("coins")) || 1000)
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches; // zistime, ci sme na dotykovom zariadeni alebo pc
    const [isRulesVisible, setIsRulesVisible] = useState(false);
    const [isLevelsVisible, setIsLevelsVisible] = useState(false);
    const OPTIONS = {}
    const SLIDE_COUNT = 10
    const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

    const levelsData = levelsFromJsonFile;
    const shuffled = shuffleLevels(levelsData);

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
        localStorage.setItem("levels", JSON.stringify(shuffled));
    }, [shuffled]);
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

            {isStartPopupVisible && <CommonModal setIsPopupVisible = {setIsStartPopupVisible} text = "Ready to start the game?"/>}

            {isMenuVisible &&
                <motion.div id="MENU" initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.3}}}
                            className="rounded-2xl overflow-hidden w-[370px]  h-fit  border-yellow-300 border-3 shadow-2xl z-999">

                    <button className="bg-black text-white w-full h-16 hover:bg-gray-600 border-b-yellow-300 border-b-2"
                            onClick={() => {setIsStartPopupVisible(true)}}>Play
                    </button>
                    <button
                        className="bg-black text-white w-full h-16 hover:bg-gray-600 border-b-yellow-300 border-b-2" onClick={() => setIsLevelsVisible(true)}>Levels
                    </button>

                    <Link to="/shop" className="buttonLink">
                        <button
                            className="bg-black text-white w-full h-16 hover:bg-gray-600 border-b-yellow-300 border-b-2">Shop
                        </button>
                    </Link>
                    <button className="bg-black text-white w-full h-16 hover:bg-gray-600" onClick={() => setIsRulesVisible(true)}>Rules</button>
                </motion.div>}
            {isRulesVisible && <RulesModal setIsRulesVisible={setIsRulesVisible} isRulesVisible={isRulesVisible}/>}
            {isLevelsVisible && <LevelsCarousel slides={SLIDES} options={OPTIONS} isLevelsVisible={isLevelsVisible} setIsLevelsVisible={setIsLevelsVisible}/>}
        </div>
    )
}