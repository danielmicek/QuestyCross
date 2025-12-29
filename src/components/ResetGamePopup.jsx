import {Link} from "react-router-dom";
import { motion } from "framer-motion"
import {ACTIVE_AREA, SQUARE_SIZE} from "./shared/constants.jsx";
import CustomButton from "./CustomButton.jsx";
import {toast, Toaster} from "react-hot-toast";
import React from "react";
import Road from "./Road.jsx";

function resetGame(levels){
    for(let level of levels){
        level.passed = false
    }
    localStorage.setItem("levels", JSON.stringify(levels))
    localStorage.setItem("currentLevelIndex", "0")
    toast.success('Game reset successfully', {style: {fontWeight: "bold"}});
}
export default function ResetGamePopup({setIsPopupVisible, levels}) {
    return (
        <>
            <div className="fixed inset-0 backdrop-blur-md bg-black/30 pointer-events-auto z-1003"></div>
            <motion.div className="bg-white border-3 fixed m-0 p-3 top-1/2 left-1/2 -translate-x-1/2 transition-transform -translate-y-1/2 rounded-[20px] overflow-hidden z-10000 justify-center flex flex-col"
                        initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.1}}} style={{width: SQUARE_SIZE * ACTIVE_AREA}}>
                <h1 className="font-bold text-5xl text-center mb-3">Do you want to reset your entire progress?</h1>
                <div id = "line" className="w-full border"></div>
                <h2 className="font-bold text-xl text-center mt-2">If you do so, your game progress will be lost<br/>Coins, bought characters and abilities will persist</h2>
                <div id = "CLOSE_BUTTON" className="flex justify-around mt-5">
                    <div onClick={() => setIsPopupVisible(false)}>
                        <CustomButton text="Close"/>
                    </div>
                    <div id = "RESET_BUTTON" className= "rounded-full" onClick={() => {
                        setIsPopupVisible(false)
                        resetGame(levels)
                    }}>
                        <CustomButton text="Reset"/>
                    </div>
                </div>
            </motion.div>
        </>
    )
}