import {ACTIVE_AREA, SQUARE_SIZE} from "./shared/constants.jsx";
import CustomButton from "./CustomButton.jsx";
import Countdown from 'react-countdown';
import { motion } from "framer-motion"
import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";


function renderer({minutes, seconds, completed}) {
    if (completed) {
        return (
            <>
                <div className="fixed inset-0 backdrop-blur-md bg-black/30"></div>
                <motion.div className="bg-white border-3 fixed m-0 p-3 top-1/2 left-1/2 -translate-x-1/2 transition-transform -translate-y-1/2 rounded-[20px] overflow-hidden z-999 justify-center flex flex-col"
                            initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.1}}} style={{width: SQUARE_SIZE * ACTIVE_AREA}}>
                    <h1 className="font-bold text-5xl text-center">Game Over</h1>
                    <p className="text-center mt-5 text-lg">You did not deliver the package in time!<br/>Do you want try again?</p>
                    <div className="flex justify-around mt-5">
                        <Link to = "/" className="buttonLink">
                            <CustomButton text="Exit to Menu"/>
                        </Link>
                        <div id = "PLAY_AGAIN_BUTTON" className= "rounded-full" onClick={() => window.location.reload()}>
                            <CustomButton text="Play again"/>
                        </div>
                    </div>
                </motion.div>
            </>

        );
    } else {
        return <span className="font-bold text-2xl">{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</span>;
    }
}

export default function UpperBar({collectedCoins, exitHandler, setIsExitPopupVisible, CURRENT_LEVEL, counterRef}) {
    const [date] = useState(() => Date.now() + 1000 * CURRENT_LEVEL.time);
    const divRef = useRef(null);

    useEffect(() => {
        if(counterRef.current.isCompleted()) divRef.current.style.zIndex = 1003
    })

    return (
        <div ref = {divRef} className="w-full h-[60px] absolute top-0 z-1001 justify-center flex right-0.5 justify-self-center">
            <div className="h-full justify-around flex items-center bg-white/40 rounded-br-[20px] rounded-bl-[20px]" style={{width: SQUARE_SIZE * ACTIVE_AREA}}>
                <div id = "EXIT_BUTTON" className= "rounded-full" onClick={() => exitHandler(setIsExitPopupVisible)}>
                    <CustomButton text="Exit"/>
                </div>

                <Countdown
                    ref = {counterRef}
                    date={date}
                    renderer={renderer}
                />
                <div id = "COLLECTED_COINS" className= "rounded-full font-bold text-lg text-shadow-lg" onClick={() => counterRef.current.pause()}>
                    collected coins: {collectedCoins}
                </div>
            </div>
        </div>
    )
}