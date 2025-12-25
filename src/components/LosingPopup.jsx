import {motion} from "framer-motion";
import {ACTIVE_AREA, SQUARE_SIZE} from "./shared/constants.jsx";
import {Link} from "react-router-dom";
import CustomButton from "./CustomButton.jsx";

export default function LosingPopup() {
    return (
        <>
            <div className="fixed inset-0 backdrop-blur-md bg-black/30 pointer-events-auto z-[998]"></div>
            <motion.div className="bg-white border-3 fixed m-0 p-3 top-1/2 left-1/2 -translate-x-1/2 transition-transform -translate-y-1/2 rounded-[20px] overflow-hidden z-999 justify-center flex flex-col"
                        initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.1}}} style={{width: SQUARE_SIZE * ACTIVE_AREA}}>
                <h1 className="font-bold text-5xl text-center">Game Over</h1>
                <p className="text-center mt-5 text-lg">Oops, car go brm!<br/>Do you want try again?</p>
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
    )
}