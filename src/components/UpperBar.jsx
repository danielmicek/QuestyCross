import {ACTIVE_AREA, SQUARE_SIZE} from "./shared/constants.jsx";
import CustomButton from "./CustomButton.jsx";
import Countdown from 'react-countdown';
import { motion } from "framer-motion"
import {useEffect, useRef, useState} from "react";
import {useTimer} from "use-timer";


export default function UpperBar({
                                     collectedCoins,
                                     exitHandler,
                                     isExitPopupVisible,
                                     setIsExitPopupVisible,
                                     CURRENT_LEVEL}) {

    const divRef = useRef(null);
    const { time, start, pause, reset, status } = useTimer({
        initialTime: 5000, //CURRENT_LEVEL.time,
        endTime: 0,
        autoStart: true,
        timerType: 'DECREMENTAL',
        onTimeOver: () => setIsExitPopupVisible(true)
    });
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    useEffect(() => {
        if (isExitPopupVisible) {
            pause()
        } else {
            start()
        }
    }, [isExitPopupVisible, pause, start])


    return (
        <div ref = {divRef} className="w-full h-[60px] absolute top-0 z-1001 justify-center flex right-0.5 justify-self-center">
            <div className="h-full justify-around flex items-center bg-white/40 rounded-br-[20px] rounded-bl-[20px]" style={{width: SQUARE_SIZE * ACTIVE_AREA}}>
                <div id = "EXIT_BUTTON" className= "rounded-full" onClick={() => exitHandler(setIsExitPopupVisible)}>
                    <CustomButton text="Exit"/>
                </div>

                <span className="font-bold text-2xl">{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</span>

                <div id = "COLLECTED_COINS" className= "rounded-full font-bold text-lg text-shadow-lg">
                    collected coins: {collectedCoins}
                </div>
            </div>
        </div>
    )
}