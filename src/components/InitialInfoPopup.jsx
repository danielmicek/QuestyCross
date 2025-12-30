import {Link, useSearchParams} from "react-router-dom";
import { motion } from "framer-motion"
import {ACTIVE_AREA, SQUARE_SIZE} from "./shared/constants.jsx";
import CustomButton from "./CustomButton.jsx";
import {getCurrentLevelIndex, getRandomElement, levelIdDecryptor} from "./shared/functions.jsx";
import {useEffect} from "react";

const packages = [
    "Spoiled eggs",
    "Stinky left sock",
    "Can of warm Pepsi",
    "Public transport ticket",
    "Ariana Grande CD",
    "Half-eaten sandwich",
    "Single AirPod (right)",
    "Rubber chicken",
    "Used toothbrush",
    "Mountain air",
    "Dua Lipa shoe"
]

function isAtBottom(scrollerRef){
    const el = scrollerRef.current;
    if (!el) return false;

    return el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
}

export default function InitialInfoPopup({setIsPopupVisible, CURRENT_LEVEL, scrollerRef}) {
    const [searchParams] = useSearchParams();
    const packageType = getRandomElement(packages)
    const decryptedSelectedLevelId = searchParams ? levelIdDecryptor(parseInt(searchParams.get("levelId"))) : null

    const levelNumber = getCurrentLevelIndex(decryptedSelectedLevelId) + 1

    return (
        <>
            <div className="fixed inset-0 backdrop-blur-md bg-black/30 pointer-events-auto z-1003"></div>
            <motion.div className="bg-white border-3 fixed m-0 p-3 top-1/2 left-1/2 -translate-x-1/2 transition-transform -translate-y-1/2 rounded-[20px] overflow-hidden z-1004 justify-center flex flex-col"
                        initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.1}}} style={{width: SQUARE_SIZE * ACTIVE_AREA}}>
                <h1 className="font-bold text-5xl text-center mb-3">Level {levelNumber}</h1>
                <div id = "line" className="w-full border"></div>
                <h2 className="text-xl mt-2 w-[60%]"><b>Package:</b> {packageType}</h2>
                <h2 className="text-xl mt-2"><b>Time:</b> {CURRENT_LEVEL.time} sec</h2>
                <h2 className="text-xl mt-2"><b>Difficulty:</b> {CURRENT_LEVEL.difficulty}</h2>
                <img src="./backpack.png" alt="backpack" className="w-[180px] absolute right-0 mb-4"/>

                <div id = "line2" className="w-full border mt-2"></div>
                <div className="flex justify-around mt-5">
                    <Link to=".." className="buttonLink">
                        <CustomButton text="Exit to Menu"/>
                    </Link>
                    <div id = "PLAY_BUTTON" className= "rounded-full" onClick={() => {if(isAtBottom(scrollerRef) === true) setIsPopupVisible(false)}}>
                        <CustomButton text="Play"/>
                    </div>

                </div>
            </motion.div>
        </>
    )
}