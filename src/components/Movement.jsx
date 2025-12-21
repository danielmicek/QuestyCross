import { motion } from "framer-motion"
import {useEffect} from "react";


function calculateGridLocationFromPixels(x, y, SQUARE_SIZE, scrollerRef){
    const x_grid = Math.floor(x / SQUARE_SIZE)
    const y_grid = scrollerRef.current.scrollTop / SQUARE_SIZE + 6  // vypocitana y-ova pozicia figurky vzhladom na grid -> +6 pretoze v DroppableFigure je gridRowStart: 6
    return {"x_grid": x_grid,                                                // TODO bude to treba zmenit ked budem nastavovat tu hodnotu dynamicky !!!!
            "y_grid": y_grid}
}

function obstacleFinder(figureRef){

}

function coinCollector(figureRef, coinsPositions, SQUARE_SIZE, scrollerRef, coinsRefs, setCollectedCoins){
    // suradnice figurky v px
    const figureX_px = figureRef.current.getBoundingClientRect().x
    const figureY_px = figureRef.current.getBoundingClientRect().y
    const figure_grid_position = calculateGridLocationFromPixels(figureX_px, figureY_px, SQUARE_SIZE, scrollerRef)
    for(let i = 0; i < coinsPositions.length; i++) {
        // suradnice figurky v gride
        const coin_grid_position = {
            "x_grid": coinsPositions[i].x,
            "y_grid": coinsPositions[i].y
        }
        // zistime, ci sa nachadza v rovnakom mieste v gride ako figure
        if(figure_grid_position.x_grid === coin_grid_position.x_grid && figure_grid_position.y_grid === coin_grid_position.y_grid){
            coinsRefs.current[i].style.display = "none" // odstranime coin z mapy
            setCollectedCoins(prev => prev + 1) // ak je coin na danom square na ktory som stupil => collectedCoins +1
            return true
        }
    }
    return false
}

function rightClickHandler({setPosX, setRotate, SQUARE_SIZE, NUM_OF_COLUMNS, setCollectedCoins, figureRef, coinsPositions, scrollerRef, coinsRefs}){
    setPosX(posX => posX === NUM_OF_COLUMNS ? posX : posX + 1)
    setRotate(90)
    coinCollector(figureRef, coinsPositions, SQUARE_SIZE, scrollerRef, coinsRefs, setCollectedCoins)
}

function leftClickHandler({setPosX, setRotate, SQUARE_SIZE, setCollectedCoins, figureRef, coinsPositions, scrollerRef, coinsRefs}){
    setPosX(posX => posX === 1 ? posX : posX - 1)
    setRotate(270)
    coinCollector(figureRef, coinsPositions, SQUARE_SIZE, scrollerRef, coinsRefs, setCollectedCoins)
}

function upClickHandler({scrollerRef, setRotate, SQUARE_SIZE, setCollectedCoins, figureRef, coinsPositions, coinsRefs}){
    const currentScroll = scrollerRef.current.scrollTop
    const currentRow = Math.round(currentScroll / SQUARE_SIZE)
    const newRow = currentRow - 1
    scrollerRef.current.scrollTop = newRow * SQUARE_SIZE
    setRotate(prev => prev === 270 || prev === 360 ? 360 : 0)
    coinCollector(figureRef, coinsPositions, SQUARE_SIZE, scrollerRef, coinsRefs, setCollectedCoins)
}

function downClickHandler({scrollerRef, setRotate, SQUARE_SIZE, setCollectedCoins, figureRef, coinsPositions, coinsRefs}){
    const currentScroll = scrollerRef.current.scrollTop
    const currentRow = Math.round(currentScroll / SQUARE_SIZE)
    const newRow = currentRow + 1
    scrollerRef.current.scrollTop = newRow * SQUARE_SIZE
    setRotate(180)
    coinCollector(figureRef, coinsPositions, SQUARE_SIZE, scrollerRef, coinsRefs, setCollectedCoins)
}

// funkcia na zistenie, ake tlacidlo bolo stlacene
// nasledne vykona rovnaku akciu (funkciu) ako po stlaceni arrow na obrazovke
function whatKeyWasPressed({
                               key,
                               scrollerRef,
                               setRotate,
                               SQUARE_SIZE,
                               setPosX,
                               NUM_OF_COLUMNS,
                               NUM_OF_ROWS,
                               setCollectedCoins,
                               figureRef,
                               coinsPositions,
                               coinsRefs
                           }){
    switch(key){
        case "w": upClickHandler({
            scrollerRef,
            setRotate,
            SQUARE_SIZE,
            NUM_OF_ROWS,
            setCollectedCoins,
            figureRef,
            coinsPositions,
            coinsRefs
        })
                  break
        case "a": leftClickHandler({
            setPosX,
            setRotate,
            SQUARE_SIZE,
            NUM_OF_ROWS,
            setCollectedCoins,
            figureRef,
            coinsPositions,
            scrollerRef,
            coinsRefs
        })
                  break
        case "s": downClickHandler({
            scrollerRef,
            setRotate,
            SQUARE_SIZE,
            NUM_OF_ROWS,
            setCollectedCoins,
            figureRef,
            coinsPositions,
            coinsRefs
        })
                  break
        case "d": rightClickHandler({
            setPosX,
            setRotate,
            SQUARE_SIZE,
            NUM_OF_COLUMNS,
            NUM_OF_ROWS,
            setCollectedCoins,
            figureRef,
            coinsPositions,
            scrollerRef,
            coinsRefs
        })
                  break
    }
}

export default function Movement({
                                     setPosX,
                                     setRotate,
                                     scrollerRef,
                                     SQUARE_SIZE,
                                     NUM_OF_COLUMNS,
                                     NUM_OF_ROWS,
                                     setCollectedCoins,
                                     figureRef,
                                     coinsPositions,
                                     coinsRefs}){
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches; // zistime, ci sme na dotykovom zariadeni alebo pc
    useEffect(() => {   // eventlistener na WASD clicky, odstrani sa po unmounte komponentu
        const handler = (e) => {
            whatKeyWasPressed({
                key: e.key,
                scrollerRef,
                setRotate,
                SQUARE_SIZE,
                setPosX,
                NUM_OF_COLUMNS,
                NUM_OF_ROWS,
                setCollectedCoins,
                figureRef,
                coinsPositions,
                coinsRefs
            });
        }
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [scrollerRef, setRotate, SQUARE_SIZE, setPosX]);


    return(
        isTouchDevice ?
            <>
                <div id = "ARROWS_UP_DOWN" className= "h-[220px] w-28 grid grid-cols-[1fr] grid-rows-[1fr_1fr] fixed  gap-2 bottom-5 left-0 z-1000 justify-items-center items-center">
                    <motion.div whileHover={{scale: 1.1}} // ARROW UP ↑
                                whileTap={{scale: 0.95}}
                                className="col-start-1 row-start-1 bg-[url('/arrow.png')] bg-contain bg-no-repeat w-22 h-22"
                                onClick={() =>
                                    upClickHandler({scrollerRef, setRotate, SQUARE_SIZE, setCollectedCoins, figureRef, coinsPositions, coinsRefs})}>
                    </motion.div>
                    <motion.div whileHover={{scale: 1.1}} // ARROW DOWN ↓
                                whileTap={{scale: 0.95}}
                                className="col-start-1 row-start-2 bg-[url('/arrow.png')] bg-contain bg-no-repeat rotate-180 w-22 h-22"
                                onClick={() =>
                                    downClickHandler({scrollerRef, setRotate, SQUARE_SIZE, setCollectedCoins, figureRef, coinsPositions, coinsRefs})}>
                    </motion.div>
                </div>

                <div id = "ARROWS_RIGHT_LEFT" className= "w-[220px] h-28 grid grid-cols-[1fr_1fr] grid-rows-[1fr] fixed gap-2 bottom-5 right-0 z-1000 justify-items-center items-center">
                    <motion.div whileHover={{scale: 1.1}} // ARROW LEFT ←
                                whileTap={{scale: 0.95}}
                                className="col-start-1 row-start-1 bg-[url('/arrow.png')] bg-contain bg-no-repeat rotate-270 w-22 h-22"
                                onClick={() =>
                                    leftClickHandler({setPosX, setRotate, SQUARE_SIZE, setCollectedCoins, figureRef, coinsPositions, scrollerRef, coinsRefs})}>
                    </motion.div>
                    <motion.div whileHover={{scale: 1.1}} // ARROW RIGHT →
                                whileTap={{scale: 0.95}}
                                className="col-start-2 row-start-1 bg-[url('/arrow.png')] bg-contain bg-no-repeat rotate-90 w-22 h-22"
                                onClick={() =>
                                    rightClickHandler({setPosX, setRotate, SQUARE_SIZE, NUM_OF_COLUMNS, setCollectedCoins, figureRef, coinsPositions, scrollerRef, coinsRefs})}>
                    </motion.div>
                </div>
            </>
            :
            <div className="w-[220px] h-44 pb-6 grid grid-cols-[1fr_1fr_1fr] grid-rows-[1fr_1fr] gap-2 fixed bottom-5 right-5 z-1000">
                <motion.div whileHover={{scale: 1.1}} // ARROW UP ↑
                            whileTap={{scale: 0.95}}
                            className="col-start-2 row-start-1 bg-[url('/arrow.png')] bg-contain bg-no-repeat"
                            onClick={() =>
                                upClickHandler({scrollerRef, setRotate, SQUARE_SIZE, setCollectedCoins, figureRef, coinsPositions, coinsRefs})}>
                </motion.div>
                <motion.div whileHover={{scale: 1.1}} // ARROW LEFT ←
                            whileTap={{scale: 0.95}}
                            className="col-start-1 row-start-2 bg-[url('/arrow.png')] bg-contain bg-no-repeat rotate-270"
                            onClick={() =>
                                leftClickHandler({setPosX, setRotate, SQUARE_SIZE, setCollectedCoins, figureRef, coinsPositions, scrollerRef, coinsRefs})}>
                </motion.div>
                <motion.div whileHover={{scale: 1.1}} // ARROW DOWN ↓
                            whileTap={{scale: 0.95}}
                            className="col-start-2 row-start-2 bg-[url('/arrow.png')] bg-contain bg-no-repeat rotate-180 mb-1"
                            onClick={() =>
                                downClickHandler({scrollerRef, setRotate, SQUARE_SIZE, setCollectedCoins, figureRef, coinsPositions, coinsRefs})}>
                </motion.div>
                <motion.div whileHover={{scale: 1.1}} // ARROW RIGHT →
                            whileTap={{scale: 0.95}}
                            className="col-start-3 row-start-2 bg-[url('/arrow.png')] bg-contain bg-no-repeat rotate-90"
                            onClick={() =>
                                rightClickHandler({setPosX, setRotate, SQUARE_SIZE, NUM_OF_COLUMNS, setCollectedCoins, figureRef, coinsPositions, scrollerRef, coinsRefs})}>
                </motion.div>
                <motion.div className="absolute bottom-0 font-bold w-full text-center">or use WASD
                </motion.div>
            </div>


    )
}