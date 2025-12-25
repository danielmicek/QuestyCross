import {motion} from "framer-motion";
import {ACTIVE_AREA, SQUARE_SIZE} from "./shared/constants.jsx";
import {Link} from "react-router-dom";
import CustomButton from "./CustomButton.jsx";

function updateCurrentLevel(CURRENT_LEVEL){
    const levels = JSON.parse(localStorage.getItem("levels"))

    const updatedLevels = levels.map(level => level.id === CURRENT_LEVEL.id ? {...level, passed: true} : level)
    localStorage.setItem("levels", JSON.stringify(updatedLevels))

}

export default function WinningPopup({collectedCoins, coins2x, coins3x, CURRENT_LEVEL}) {
    let total = CURRENT_LEVEL.coinsCount
    if(coins2x) total *= 2;
    if(coins3x) total *= 3;

    updateCurrentLevel(CURRENT_LEVEL)


    return (
        <>
            <div className="fixed inset-0 backdrop-blur-md bg-black/30 pointer-events-auto z-1003"></div>
            <motion.div className="bg-white border-3 fixed m-0 p-3 top-1/2 left-1/2 -translate-x-1/2 transition-transform -translate-y-1/2 rounded-[20px] overflow-hidden z-1004 justify-center flex flex-col"
                        initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.1}}} style={{width: SQUARE_SIZE * ACTIVE_AREA}}>
                <h1 className="font-bold text-5xl text-center">Win!</h1>
                <h2 className="font-bold text-xl text-center mt-2">You delivered the package in time</h2>
                <div id = "line1" className="w-full border"></div>


                <p className="text-center mt-2"><b>coins: </b>{collectedCoins}/{total}</p>
                <p className="text-center mb-2"><b>time: </b>{collectedCoins}/{total}</p>


                <div id = "line2" className="w-full border"></div>
                <div className="flex justify-around mt-5">
                    <Link to = "/" className="buttonLink">
                        <CustomButton text="Exit to Menu"/>
                    </Link>
                    <div id = "PLAY_AGAIN_BUTTON" className= "rounded-full" onClick={() => window.location.reload()}>
                        <CustomButton text="Next level"/>
                    </div>
                </div>
            </motion.div>
        </>
    )
}