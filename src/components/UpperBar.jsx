import {ACTIVE_AREA, SQUARE_SIZE} from "./shared/constants.jsx";
import CustomButton from "./CustomButton.jsx";
import {useEffect, useRef, useState} from "react";
import {useTimer} from "use-timer";


export default function UpperBar({
                                     collectedCoins,
                                     isPausePopupVisible,
                                     setIsPausePopupVisible,
                                     isLosingPopupVisible}) {

    const divRef = useRef(null);
    const { time, start, pause, reset, status } = useTimer({
        initialTime: 5000, //CURRENT_LEVEL.time,
        endTime: 0,
        autoStart: true,
        timerType: 'DECREMENTAL',
        onTimeOver: () => setIsPausePopupVisible(true)
    });
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    useEffect(() => {
        if (isPausePopupVisible || isLosingPopupVisible) {
            pause()
        } else {
            start()
        }
    }, [isPausePopupVisible, pause, start])


    return (
        <div ref = {divRef} className="w-full h-[60px] absolute top-0 z-1001 justify-center flex right-0.5 justify-self-center">
            <div className="h-full justify-around flex items-center bg-white/40 rounded-br-[20px] rounded-bl-[20px]" style={{width: SQUARE_SIZE * ACTIVE_AREA}}>
                <div id = "EXIT_BUTTON" className= "rounded-full" onClick={() => setIsPausePopupVisible(true)}>
                    <CustomButton text="Pause"/>
                </div>

                <span className="font-bold text-2xl">{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</span>

                <div id = "COLLECTED_COINS" className= "rounded-full font-bold text-lg text-shadow-lg">
                    collected coins: {collectedCoins}
                </div>
            </div>
        </div>
    )
}