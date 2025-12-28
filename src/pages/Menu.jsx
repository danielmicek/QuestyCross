import React, {useEffect, useState} from 'react'
import {Link, useLocation} from "react-router-dom";
import { motion } from "motion/react"

import figuresFromJsonFile from "../../data/figures.json"
import abilitiesFromJsonFile from "../../data/abilities.json"
import levelsFromJsonFile from "../../data/levels.json"
import RulesModal from "../components/RulesModal.jsx";
import CommonModal from "../components/CommonModal.jsx";
import LevelsCarousel from "../components/LevelsCarousel.jsx";
import {toast, Toaster} from "react-hot-toast";
import {ACTIVE_AREA, SQUARE_SIZE} from "../components/shared/constants.jsx";
import CustomButton from "../components/CustomButton.jsx";
import ResetGamePopup from "../components/ResetGamePopup.jsx";


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

function getFirstUnfinishedLevelIndex(levels) {
    for(let i = 0; i < levels.length; i++) {
        if(!levels[i].passed) return i;
    }
    return 0
}

function isGameFinishedFinder(levels) {
    return levels.every(level => level.passed);
}

export default function Menu() {
    const [isStartPopupVisible, setIsStartPopupVisible] = useState(false)
    const [coins] = useState(parseInt(localStorage.getItem("coins")) || 1000)
    const [isRulesVisible, setIsRulesVisible] = useState(false);
    const [isLevelsVisible, setIsLevelsVisible] = useState(false);
    const [isGameResetVisible, setIsGameResetVisible] = useState(false);
    const levelsData = levelsFromJsonFile;
    const [levels] = useState(localStorage.getItem("levels") !== null ? JSON.parse(localStorage.getItem("levels")) : shuffleLevels(levelsData));  // Levely zamiesame a lazy inicializujeme, ak predtym neboli zamiesane
    const [isGameFinished, setIsGameFinished] = useState(() => isGameFinishedFinder(levels))

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
        localStorage.setItem("levels", JSON.stringify(levels));
    }, [levels]);
    useEffect(() => { // ulozenie currentLevelIndex do localStorage
        localStorage.setItem("currentLevelIndex", getFirstUnfinishedLevelIndex(levels).toString());
    }, [levels]);
    const OPTIONS = {}
    //Urobime array s IDs levelov
    const LEVEL_IDS = levels ? levels.map(level => level.id) : [];


    return (
        <>
            <Toaster position="bottom-center" reverseOrder={false}/>

            <div className="flex min-h-screen items-center justify-center bg-[url('/grass.jpg')]">
                {/*<video src="/grass_loop.mp4"
                   autoPlay loop muted
                   className="absolute inset-0 w-full h-full object-cover">
            </video>*/}
                <motion.h1 initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.3}}}
                           className="font-bold absolute top-0 md:text-8xl text-6xl mt-10 text-shadow-lg">QuestyCross
                </motion.h1>

                {isStartPopupVisible && <CommonModal setIsPopupVisible = {setIsStartPopupVisible} text = "Ready to start the game?"/>}


                <motion.div className="bg-white w-[370px] h-fit border-3 absolute p-3 left-1/2 top-[220px] -translate-x-1/2 transition-transform rounded-[20px] overflow-hidden justify-center flex flex-col gap-3"
                            initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.1}}}>

                    <div className="border-2 h-12 text-center border-black w-full rounded-full flex shadow-lg hover:scale-102 justify-center items-center font-bold text-lg cursor-pointer" onClick={() => {setIsStartPopupVisible(true)}}>Start</div>
                    <div className="border-2 h-12 text-center border-black w-full rounded-full flex shadow-lg hover:scale-102 justify-center items-center font-bold text-lg cursor-pointer" onClick={() => {setIsLevelsVisible(true)}}>Levels</div>
                    <Link to="/shop" className="buttonLink">
                        <div className="border-2 h-12 text-center border-black w-full rounded-full flex shadow-lg hover:scale-102 justify-center items-center font-bold text-lg cursor-pointer">Shop</div>
                    </Link>
                    <div className="border-2 h-12 text-center border-black w-full rounded-full flex shadow-lg hover:scale-102 justify-center items-center font-bold text-lg cursor-pointer" onClick={() => {setIsRulesVisible(true)}}>Rules</div>
                    <div className="border-2 h-12 text-center border-black w-full rounded-full flex shadow-lg hover:scale-102 justify-center items-center font-bold text-lg cursor-pointer"
                         style = {{backgroundColor: isGameFinished === false ? "gray" : "none"}}
                         onClick={() => {
                             if(isGameFinished === false) toast.error('Need to finish every level before resetting the game!', {style: {fontWeight: "bold"}});
                             else setIsGameResetVisible(true)
                         }}>{isGameFinished === false ? "Game reset 🔒" : "Game reset 🔓"}</div>

                </motion.div>
                {isRulesVisible && <RulesModal setIsRulesVisible={setIsRulesVisible} isRulesVisible={isRulesVisible}/>}
                {isLevelsVisible && <LevelsCarousel slides={LEVEL_IDS} options={OPTIONS} isLevelsVisible={isLevelsVisible} setIsLevelsVisible={setIsLevelsVisible} levels={levels}/>}
                {isGameResetVisible && <ResetGamePopup setIsPopupVisible = {setIsGameResetVisible} levels = {levels}/>}
            </div>
        </>
    )
}