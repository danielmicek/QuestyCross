import {Link} from "react-router-dom";
import { motion } from "framer-motion"
import {ACTIVE_AREA, SQUARE_SIZE} from "./shared/constants.jsx";
import CustomButton from "./CustomButton.jsx";

export default function Start_PauseModal({setIsPopupVisible, text, secondaryText = false}) {
    return (
        <>
            <div className="fixed inset-0 backdrop-blur-md bg-black/30 pointer-events-auto z-1003"></div>
            <motion.div className="bg-white border-3 fixed m-0 p-3 top-1/2 left-1/2 -translate-x-1/2 transition-transform -translate-y-1/2 rounded-[20px] overflow-hidden z-1004 justify-center flex flex-col"
                        initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.1}}} style={{width: SQUARE_SIZE * ACTIVE_AREA}}>
                <h1 className="font-bold text-5xl text-center mb-3">{text}</h1>
                <div id = "line" className="w-full border"></div>
                {secondaryText && <h2 className="font-bold text-xl text-center mt-2">If you decide to leave, your will be lost</h2>}
                <div className="flex justify-around mt-5">
                    <Link to = "/" className="buttonLink">
                        <CustomButton text="Exit to Menu"/>
                    </Link>
                    {secondaryText && <div id = "CONTINUE_PLAYING_BUTTON" className= "rounded-full" onClick={() => setIsPopupVisible(false)}>
                        <CustomButton text="Resume"/>
                    </div>}
                    {!secondaryText && <Link to="/game" className="buttonLink">
                        <CustomButton text="Play"/>
                    </Link>}
                </div>
            </motion.div>
        </>
    )
}