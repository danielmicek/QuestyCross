import { motion } from "framer-motion"
import {useEffect} from "react";

function obstacleFinder(figureRef){

}

function rightClickHandler(setPosX, setRotate, NUM_OF_COLUMNS){
    setPosX(posX => posX === NUM_OF_COLUMNS ? posX : posX + 1)
    setRotate(90)
}

function leftClickHandler(setPosX, setRotate){
    setPosX(posX => posX === 1 ? posX : posX - 1)
    setRotate(270)
}

function upClickHandler(scrollerRef, setRotate, SQUARE_SIZE){
    const currentScroll = scrollerRef.current.scrollTop
    const currentRow = Math.round(currentScroll / SQUARE_SIZE)
    const newRow = currentRow - 1
    scrollerRef.current.scrollTop = newRow * SQUARE_SIZE
    setRotate(prev => prev === 270 || prev === 360 ? 360 : 0)
}

function downClickHandler(scrollerRef, setRotate, SQUARE_SIZE){
    const currentScroll = scrollerRef.current.scrollTop
    const currentRow = Math.round(currentScroll / SQUARE_SIZE)
    const newRow = currentRow + 1
    scrollerRef.current.scrollTop = newRow * SQUARE_SIZE
    setRotate(180)
}

// funkcia na zistenie, ake tlacidlo bolo stlacene
// nasledne vykona rovnaku akciu (funkciu) ako po stlaceni arrow na obrazovke
function whatKeyWasPressed(key, scrollerRef, setRotate, SQUARE_SIZE, setPosX, NUM_OF_COLUMNS){
    switch(key){
        case "w": upClickHandler(scrollerRef, setRotate, SQUARE_SIZE); break
        case "a": leftClickHandler(setPosX, setRotate); break
        case "s": downClickHandler(scrollerRef, setRotate, SQUARE_SIZE); break
        case "d": rightClickHandler(setPosX, setRotate, NUM_OF_COLUMNS); break
    }
}

export default function Movement({
                                     setPosX,
                                     setRotate,
                                     scrollerRef,
                                     SQUARE_SIZE,
                                     NUM_OF_COLUMNS,
                                     setGatheredCoins,
                                     figureRef}){
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches; // zistime, ci sme na dotykovom zariadeni alebo pc
    useEffect(() => {   // eventlistener na WASD clicky, odstrani sa po unmounte komponentu
        const handler = (e) => {
            whatKeyWasPressed(e.key, scrollerRef, setRotate, SQUARE_SIZE, setPosX, NUM_OF_COLUMNS);
        }
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [scrollerRef, setRotate, SQUARE_SIZE, setPosX]);

    console.log(figureRef);

    return(
        isTouchDevice ?
            <>
                <div id = "ARROWS_UP_DOWN" className= "h-[220px] w-28 grid grid-cols-[1fr] grid-rows-[1fr_1fr] fixed  gap-2 bottom-5 left-0 z-1000 justify-items-center items-center">
                    <motion.div whileHover={{scale: 1.1}} // ARROW UP ↑
                                whileTap={{scale: 0.95}}
                                className="col-start-1 row-start-1 bg-[url('/arrow.png')] bg-contain bg-no-repeat w-22 h-22"
                                onClick={() => upClickHandler(scrollerRef, setRotate, SQUARE_SIZE)}>
                    </motion.div>
                    <motion.div whileHover={{scale: 1.1}} // ARROW DOWN ↓
                                whileTap={{scale: 0.95}}
                                className="col-start-1 row-start-2 bg-[url('/arrow.png')] bg-contain bg-no-repeat rotate-180 w-22 h-22"
                                onClick={() => downClickHandler(scrollerRef, setRotate, SQUARE_SIZE)}>
                    </motion.div>
                </div>

                <div id = "ARROWS_RIGHT_LEFT" className= "w-[220px] h-28 grid grid-cols-[1fr_1fr] grid-rows-[1fr] fixed gap-2 bottom-5 right-0 z-1000 justify-items-center items-center">
                    <motion.div whileHover={{scale: 1.1}} // ARROW LEFT ←
                                whileTap={{scale: 0.95}}
                                className="col-start-1 row-start-1 bg-[url('/arrow.png')] bg-contain bg-no-repeat rotate-270 w-22 h-22"
                                onClick={() => leftClickHandler(setPosX, setRotate)}>
                    </motion.div>
                    <motion.div whileHover={{scale: 1.1}} // ARROW RIGHT →
                                whileTap={{scale: 0.95}}
                                className="col-start-2 row-start-1 bg-[url('/arrow.png')] bg-contain bg-no-repeat rotate-90 w-22 h-22"
                                onClick={() => rightClickHandler(setPosX, setRotate, NUM_OF_COLUMNS)}>
                    </motion.div>
                </div>
            </>
            :
            <div className="w-[220px] h-44 pb-6 grid grid-cols-[1fr_1fr_1fr] grid-rows-[1fr_1fr] gap-2 fixed bottom-5 right-5 z-1000">
                <motion.div whileHover={{scale: 1.1}} // ARROW UP ↑
                            whileTap={{scale: 0.95}}
                            className="col-start-2 row-start-1 bg-[url('/arrow.png')] bg-contain bg-no-repeat"
                            onClick={() => upClickHandler(scrollerRef, setRotate, SQUARE_SIZE)}>
                </motion.div>
                <motion.div whileHover={{scale: 1.1}} // ARROW LEFT ←
                            whileTap={{scale: 0.95}}
                            className="col-start-1 row-start-2 bg-[url('/arrow.png')] bg-contain bg-no-repeat rotate-270"
                            onClick={() => leftClickHandler(setPosX, setRotate)}>
                </motion.div>
                <motion.div whileHover={{scale: 1.1}} // ARROW DOWN ↓
                            whileTap={{scale: 0.95}}
                            className="col-start-2 row-start-2 bg-[url('/arrow.png')] bg-contain bg-no-repeat rotate-180 mb-1"
                            onClick={() => downClickHandler(scrollerRef, setRotate, SQUARE_SIZE)}>
                </motion.div>
                <motion.div whileHover={{scale: 1.1}} // ARROW RIGHT →
                            whileTap={{scale: 0.95}}
                            className="col-start-3 row-start-2 bg-[url('/arrow.png')] bg-contain bg-no-repeat rotate-90"
                            onClick={() => rightClickHandler(setPosX, setRotate, NUM_OF_COLUMNS)}>
                </motion.div>
                <motion.div className="absolute bottom-0 font-bold w-full text-center">or use WASD
                </motion.div>
            </div>


    )
}