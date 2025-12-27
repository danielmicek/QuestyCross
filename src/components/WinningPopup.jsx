import {motion, time} from "framer-motion";
import {ACTIVE_AREA, SQUARE_SIZE} from "./shared/constants.jsx";
import {Link} from "react-router-dom";
import CustomButton from "./CustomButton.jsx";
import {getCurrentLevel} from "./shared/functions.jsx";

// updates "passed" field from false to true
// pripocitaj collectedCoins k celkovym coinom
function finishCurrentLevel(CURRENT_LEVEL, levels, setCoins, coins, collectedCoins, actualTime){
    let updatedLevels = levels.map(level => level.id === CURRENT_LEVEL.id ? {...level, passed: true} : level)
    updatedLevels = levels.map(level => actualTime > level.bestTime ? {...level, bestTime: actualTime} : level)
    const newCoins = collectedCoins + coins
    setCoins(newCoins)
    localStorage.setItem("coins", newCoins.toString())
    localStorage.setItem("levels", JSON.stringify(updatedLevels))

    window.location.reload()
}

function calculateTime(totalTime, playersTime){
    const actualTime = totalTime - playersTime
    const minutes = Math.floor(actualTime / 60);
    const seconds = actualTime % 60;
    return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
}

export default function WinningPopup({collectedCoins, coins2x, coins3x, CURRENT_LEVEL, time, coins, setCoins}) {
    let total = CURRENT_LEVEL.coinsCount // vzdy 20
    if(coins2x) total *= 2;
    if(coins3x) total *= 3;

    const levels = JSON.parse(localStorage.getItem("levels"))
    const actualTime = calculateTime(CURRENT_LEVEL.time, time)
    const bestTime = CURRENT_LEVEL.bestTime

    return (
        <>
            <div className="fixed inset-0 backdrop-blur-md bg-black/30 pointer-events-auto z-1003"></div>
            <motion.div className="bg-white border-3 fixed m-0 p-3 top-1/2 left-1/2 -translate-x-1/2 transition-transform -translate-y-1/2 rounded-[20px] overflow-hidden z-1004 justify-center flex flex-col"
                        initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.1}}} style={{width: SQUARE_SIZE * ACTIVE_AREA}}>
                <h1 className="font-bold text-5xl text-center">Win!</h1>
                <h2 className="font-bold text-xl text-center mt-2">You delivered the package in time</h2>
                <div id = "line1" className="w-full border"></div>

                <p className="text-center mt-2"><b>collected coins: </b>{collectedCoins}/{total}</p>
                <p className="text-center"><b>total coins: </b>{coins + collectedCoins}</p>
                <p className="text-center mt-2"><b>time: </b>{calculateTime(CURRENT_LEVEL.time, time)}</p>
                <p className="text-center"><b>best time: </b>{actualTime}</p>
                <p className="text-center mt-2 mb-2"><b>next level difficulty: </b>{getCurrentLevel(levels).difficulty}</p>


                <div id = "line2" className="w-full border"></div>
                <div className="flex justify-around mt-5">
                    <Link to = "/" className="buttonLink">
                        <CustomButton text="Exit to Menu"/>
                    </Link>
                    <div id = "PLAY_AGAIN_BUTTON" className= "rounded-full" onClick={() => window.location.reload()}>
                        <CustomButton text="Play again"/>
                    </div>
                    <div id = "PLAY_AGAIN_BUTTON" className= "rounded-full" onClick={() => finishCurrentLevel(CURRENT_LEVEL, levels, setCoins, coins, collectedCoins, actualTime)}>
                        <CustomButton text="Next level"/>
                    </div>
                </div>
            </motion.div>
        </>
    )
}