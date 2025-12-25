import { motion } from "framer-motion"
import {useEffect} from "react";
import {useTimer} from "use-timer";


export default function AbilityTimer({shield, setShield, isLosingPopupVisible}) {

    const { time, start, pause, reset, status } = useTimer({
        initialTime: 5,
        endTime: 0,
        autoStart: false,
        timerType: 'DECREMENTAL',
        onTimeOver: () => setShield(false)
    });
    const seconds = time % 60;

    useEffect(() => {
        if(shield) start()
    }, [shield, start])
    
    useEffect(() => {
        if (!shield) return
        else if(isLosingPopupVisible) pause()
        else start()
    }, [pause, isLosingPopupVisible, start, shield])

    return (
        <>
            {shield &&
                <motion.div  className="w-full h-[60px] absolute top-[62px] z-1001 justify-center flex right-0.5 justify-self-center"
                             initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.1}}}>
                    <div className="h-1/2 justify-around flex items-center bg-white/40 rounded-[20px] w-[200px]">
                        <span className="font-bold text-xl">shield - {seconds}</span>
                    </div>
                </motion.div>
            }
        </>
    )
}