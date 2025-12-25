import {motion} from "framer-motion";
import {ACTIVE_AREA, SQUARE_SIZE} from "./shared/constants.jsx";
import {Link} from "react-router-dom";
import CustomButton from "./CustomButton.jsx";

export default function RulesModal({ setIsRulesVisible }) {
    return (
        <>
            <div className="fixed inset-0 backdrop-blur-md bg-black/30 pointer-events-auto z-1003"></div>
            <motion.div className="bg-white border-3 fixed m-0 p-3 top-1/2 left-1/2 -translate-x-1/2 transition-transform -translate-y-1/2 rounded-[20px] overflow-hidden z-1004 justify-center flex flex-col w-[900px] max-w-[90vw"
                        initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.1}}} style={{width: SQUARE_SIZE * ACTIVE_AREA}}>
                <h1 className="font-bold text-5xl text-center">Rules and game info</h1>
                <p className=" text-xl text-center mt-2">Questy Cross is an arcade game inspired by Crossy Road. Your goal is to deliver the package to the finish
                    point within a time limit while safely avoiding cars and other obstacles.
                    <br/>
                    The game features three difficulty levels:
                    Easy – slower traffic and more time
                    Medium – balanced difficulty
                    Hard – fast vehicles and limited time
                    During gameplay, you can collect coins. Coins can be spent in the shop to buy and equip character skins, which are purely cosmetic.
                    Controls
                    PC: keyboard controls
                    Mobile: touch-based controls optimized for small screens</p>
                <div id = "line1" className="w-full border"></div>

                <div id = "line2" className="w-full border"></div>
                <div className="flex justify-around mt-5" onClick={() => setIsRulesVisible(false)}>
                    <Link to = "/" className="buttonLink">
                        <CustomButton text="Exit to Menu"/>
                    </Link>
                </div>
            </motion.div>
        </>
    )
}