import {Link} from "react-router-dom";
import { motion } from "framer-motion"

export default function ExitModal({setIsExitPopupVisible}) {
    return (
        <>
            <div className="fixed inset-0 backdrop-blur-md bg-black/30 pointer-events-auto z-1003"></div>
            <motion.div id="LEAVE_GAME_POPUP" initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.1}}}
                        className="border-2 fixed m-0 top-1/2 left-1/2 -translate-x-1/2 transition-transform -translate-y-1/2 rounded-2xl w-[370px] overflow-hidden z-1004">
                <div>
                    <h3 className="font-bold text-2xl text-center bg-yellow-300 p-2 "> Are you sure you want to leave?</h3>
                    <div>
                        <Link to = "/" className="buttonLink">
                            <motion.button id = "YES_BUTTON" className="bg-black text-white font-bold w-full h-16 hover:bg-gray-600 border-b-yellow-300 border-b-2">
                                Yes
                            </motion.button>
                        </Link>

                        <motion.button id = "NO_BUTTON" className="bg-black text-white font-bold w-full h-16 hover:bg-gray-600"
                                       onClick={() => setIsExitPopupVisible(false)}>No
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </>
    )
}