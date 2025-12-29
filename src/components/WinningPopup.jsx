import {motion} from "framer-motion";
import {ACTIVE_AREA, SQUARE_SIZE} from "./shared/constants.jsx";
import {Link, useSearchParams} from "react-router-dom";
import CustomButton from "./CustomButton.jsx";
import {
    calculateBestTime,
    calculateTime,
    getCurrentLevel,
    levelIdDecryptor
} from "./shared/functions.jsx";
import {useEffect} from "react";

// ziska id nasledujuceho levelu
function getNextLevelId(levels, currentLevelId){
    for(let i = 0; i < levels.length; i++){
        if(levelIdDecryptor(levels[i].id) === currentLevelId) return levelIdDecryptor(levels[i + 1].id)
    }
}

// updates "passed" field from false to true
// pripocitaj collectedCoins k celkovym coinom
function finishCurrentLevel(CURRENT_LEVEL, levels, setCoins, coins, collectedCoins, actualTime){
    let updatedLevels = levels.map(level => level.id === CURRENT_LEVEL.id ? {...level, passed: true} : level)

    // ak je bestTime === 0 tak to nastavi actualTime, inak sa bestTime aktualizuje iba ak je actualTime mensi
    updatedLevels = updatedLevels.map(level => level.id === CURRENT_LEVEL.id ?
        (level.bestTime === 0 ? {...level, bestTime: actualTime}
            :
            (actualTime < level.bestTime ? {...level, bestTime: actualTime} : level))
        :
        level)

    const newCoins = collectedCoins + coins
    setCoins(newCoins)
    localStorage.setItem("coins", newCoins.toString())
    localStorage.setItem("levels", JSON.stringify(updatedLevels))
}

function loadNextLevel(levels, searchParam, setSearchParams, setCurrentLevelIndex){
    if(searchParam){
        const nextLevelId = getNextLevelId(levels, levelIdDecryptor(parseInt(searchParam)))
        setSearchParams({"levelId": `7845${nextLevelId}9`})
    }

    // nacitanie indexu dalsieho levelu do localStorage
    setCurrentLevelIndex(prev => {
        const newIndex = prev + 1 <= levels.length - 1 ? prev + 1 : 0
        localStorage.setItem("currentLevelIndex", newIndex.toString())
        return newIndex
    })

    window.location.reload()
}

export default function WinningPopup({collectedCoins, CURRENT_LEVEL, time, coins, setCoins, currentLevelIndex, setCurrentLevelIndex, selectedLevelId}) {
    let total = 20 // vzdy 20
    if(localStorage.getItem("coin2x") === "true") total *= 2;
    if(localStorage.getItem("coin3x") === "true") total *= 3;

    const levels = JSON.parse(localStorage.getItem("levels"))
    const actualTime = CURRENT_LEVEL.time - time
    const bestTime = CURRENT_LEVEL.bestTime === 0 ? actualTime
        : (actualTime > CURRENT_LEVEL.bestTime ? CURRENT_LEVEL.bestTime : actualTime)
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        finishCurrentLevel(CURRENT_LEVEL, levels, setCoins, coins, collectedCoins, actualTime)
    }, []);

    const currentLevelId = CURRENT_LEVEL.id
    const nextLevel = currentLevelIndex < 7 ? getCurrentLevel(levels, getNextLevelId(levels, selectedLevelId ? selectedLevelId : levelIdDecryptor(currentLevelId))) : null

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
                <p className="text-center"><b>best time: </b>{calculateBestTime(bestTime)}</p>
                {currentLevelIndex !== levels.length - 1 &&
                    <p className="text-center mt-2 mb-2"><b>next level difficulty: </b>{nextLevel.difficulty}</p>}


                <div id = "line2" className="w-full border"></div>
                <div className="flex justify-around mt-5">
                    <Link to = "/" className="buttonLink">
                        <CustomButton text="Exit to Menu"/>
                    </Link>
                    <div id = "PLAY_AGAIN_BUTTON" className= "rounded-full" onClick={() => window.location.reload()}>
                        <CustomButton text="Play again"/>
                    </div>
                    {currentLevelIndex !== levels.length - 1 &&
                        <div id="NEXT_LEVEL_BUTTON" className="rounded-full"
                             onClick={() => loadNextLevel(levels, searchParams.get("levelId"), setSearchParams, setCurrentLevelIndex)}>
                            <CustomButton text="Next level"/>
                        </div>
                    }
                </div>
            </motion.div>
        </>
    )
}