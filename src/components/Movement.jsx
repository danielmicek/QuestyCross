import {motion} from "framer-motion"
import {useEffect} from "react";
import {calculateGridLocationFromPixels} from "./shared/functions.jsx";
import {NO_ACCESS_AREA, NUM_OF_COLUMNS, SQUARE_SIZE} from "./shared/constants.jsx";


function obstacleFinder(figureX_grid, figureY_grid, obstaclesPositions){
    for(let obstacle of obstaclesPositions){
        if(figureX_grid === (obstacle.x + NO_ACCESS_AREA) && figureY_grid === obstacle.y) {
            return true
        }
    }
    return false
}

function showWinningPopup(){
}

function coinCollector(figureRef, posX, coinsPositions, scrollerRef, coinsRefs, setCollectedCoins){
    // suradnice figurky v gride
    const figure_grid_position = calculateGridLocationFromPixels(posX, scrollerRef)
    //console.log("fig: ", figure_grid_position.x_grid, figure_grid_position.y_grid)
    for(let i = 0; i < coinsPositions.length; i++) {
        // suradnice coinu v gride
        const coin_grid_position = {
            "x_grid": coinsPositions[i].x + NO_ACCESS_AREA,
            "y_grid": coinsPositions[i].y
        }
        // zistime, ci sa nachadza v rovnakom mieste v gride ako figure a zaroven ci nema display none (ci uz minca nebola vzatá)
        if(figure_grid_position.x_grid === coin_grid_position.x_grid && figure_grid_position.y_grid === coin_grid_position.y_grid && coinsRefs.current[i].style.display !== "none"){
            coinsRefs.current[i].style.display = "none" // odstranime coin z mapy
            setCollectedCoins(prev => prev + 1) // ak je coin na danom square na ktory som stupil => collectedCoins +1
            return true
        }
    }
    return false
}

function rightClickHandler({posX, setPosX, setRotate, setCollectedCoins, figureRef, coinsPositions, obstaclesPositions, scrollerRef, coinsRefs}){
    const newPosX = posX === NUM_OF_COLUMNS - NO_ACCESS_AREA ? posX : posX + 1
    const posY = calculateGridLocationFromPixels(posX, scrollerRef).y_grid
    setRotate(90)

    if(obstacleFinder(newPosX, posY, obstaclesPositions)) return
    else setPosX(newPosX)

    coinCollector(figureRef, newPosX, coinsPositions, scrollerRef, coinsRefs, setCollectedCoins)
}

function leftClickHandler({posX, setPosX, setRotate, setCollectedCoins, figureRef, coinsPositions, obstaclesPositions, scrollerRef, coinsRefs}){
    const newPosX = posX === NO_ACCESS_AREA + 1 ? posX : posX - 1
    const posY = calculateGridLocationFromPixels(posX, scrollerRef).y_grid
    setRotate(270)

    if(obstacleFinder(newPosX, posY, obstaclesPositions)) return
    else setPosX(newPosX)

    coinCollector(figureRef, newPosX, coinsPositions, scrollerRef, coinsRefs, setCollectedCoins)
}

function upClickHandler({ scrollerRef, setRotate, setCollectedCoins, figureRef, coinsPositions, obstaclesPositions, coinsRefs, posX }) {
    const currentScrollTop = scrollerRef.current.scrollTop;
    const topRow = Math.round(currentScrollTop / SQUARE_SIZE);
    const newTopRow = topRow - 1;
    let figurePosition = calculateGridLocationFromPixels(posX, scrollerRef);

    setRotate(prev => (prev === 270 || prev === 360 ? 360 : 0));

    if(obstacleFinder(figurePosition.x_grid, figurePosition.y_grid - 1, obstaclesPositions)) return;

    scrollerRef.current.scrollTop = newTopRow * SQUARE_SIZE;
    figurePosition = calculateGridLocationFromPixels(posX, scrollerRef); // vypocitame nanovo po tom, ako sme sa posunuli (po scrolle)

    if (figurePosition.y_grid === 10) showWinningPopup()

    coinCollector(figureRef, posX, coinsPositions, scrollerRef, coinsRefs, setCollectedCoins);
}

function downClickHandler({scrollerRef, setRotate, setCollectedCoins, figureRef, coinsPositions, obstaclesPositions, coinsRefs, posX, NUM_OF_ROWS}){
    const currentScrollTop = scrollerRef.current.scrollTop;
    const topRow = Math.round(currentScrollTop / SQUARE_SIZE);
    const newTopRow = topRow + 1;
    const figurePosition = calculateGridLocationFromPixels(posX, scrollerRef);

    setRotate(180);

    if(obstacleFinder(figurePosition.x_grid, figurePosition.y_grid + 1, obstaclesPositions)) {
        return;
    }

    scrollerRef.current.scrollTop = newTopRow * SQUARE_SIZE;

    coinCollector(figureRef, posX, coinsPositions, scrollerRef, coinsRefs, setCollectedCoins);
}

// funkcia na zistenie, ake tlacidlo bolo stlacene
// nasledne vykona rovnaku akciu (funkciu) ako po stlaceni arrow na obrazovke
function whatKeyWasPressed({
                               key,
                               scrollerRef,
                               setRotate,
                               posX,
                               setPosX,
                               NUM_OF_ROWS,
                               setCollectedCoins,
                               figureRef,
                               coinsPositions,
                               obstaclesPositions,
                               coinsRefs
                           }){
    switch(key){
        case "w": upClickHandler({
            scrollerRef,
            setRotate,
            NUM_OF_ROWS,
            setCollectedCoins,
            figureRef,
            coinsPositions,
            obstaclesPositions,
            coinsRefs,
            posX
        })
                  break
        case "a": leftClickHandler({
            posX,
            setPosX,
            setRotate,
            NUM_OF_ROWS,
            setCollectedCoins,
            figureRef,
            coinsPositions,
            obstaclesPositions,
            scrollerRef,
            coinsRefs
        })
                  break
        case "s": downClickHandler({
            scrollerRef,
            setRotate,
            NUM_OF_ROWS,
            setCollectedCoins,
            figureRef,
            coinsPositions,
            obstaclesPositions,
            coinsRefs,
            posX
        })
                  break
        case "d": rightClickHandler({
            posX,
            setPosX,
            setRotate,
            NUM_OF_ROWS,
            setCollectedCoins,
            figureRef,
            coinsPositions,
            obstaclesPositions,
            scrollerRef,
            coinsRefs
        })
                  break
    }
}

export default function Movement({
                                     posX,
                                     setPosX,
                                     setRotate,
                                     scrollerRef,
                                     NUM_OF_ROWS,
                                     setCollectedCoins,
                                     figureRef,
                                     coinsPositions,
                                     obstaclesPositions,
                                     coinsRefs,
                                 }){
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches; // zistime, ci sme na dotykovom zariadeni alebo pc
    useEffect(() => {   // eventlistener na WASD clicky, odstrani sa po unmounte komponentu
        const handler = (e) => {
            whatKeyWasPressed({
                key: e.key,
                scrollerRef,
                setRotate,
                posX,
                setPosX,
                NUM_OF_ROWS,
                setCollectedCoins,
                figureRef,
                coinsPositions,
                obstaclesPositions,
                coinsRefs
            });
        }
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [scrollerRef, setRotate, setPosX, NUM_OF_ROWS, setCollectedCoins, figureRef, coinsPositions, obstaclesPositions, coinsRefs, posX]);


    return(
        isTouchDevice ?
            <>
                <div id = "ARROWS_UP_DOWN" className= "h-[220px] w-28 grid grid-cols-[1fr] grid-rows-[1fr_1fr] fixed  gap-2 bottom-5 left-0 z-1000 justify-items-center items-center">
                    <motion.div whileHover={{scale: 1.1}} // ARROW UP ↑
                                whileTap={{scale: 0.95}}
                                className="col-start-1 row-start-1 bg-[url('/arrow.png')] bg-contain bg-no-repeat w-22 h-22"
                                onClick={() =>
                                    upClickHandler({scrollerRef, setRotate, setCollectedCoins, figureRef, coinsPositions, obstaclesPositions, coinsRefs, posX, NUM_OF_ROWS})}>
                    </motion.div>
                    <motion.div whileHover={{scale: 1.1}} // ARROW DOWN ↓
                                whileTap={{scale: 0.95}}
                                className="col-start-1 row-start-2 bg-[url('/arrow.png')] bg-contain bg-no-repeat rotate-180 w-22 h-22"
                                onClick={() =>
                                    downClickHandler({scrollerRef, setRotate, setCollectedCoins, figureRef, coinsPositions, obstaclesPositions, coinsRefs, posX, NUM_OF_ROWS})}>
                    </motion.div>
                </div>

                <div id = "ARROWS_RIGHT_LEFT" className= "w-[220px] h-28 grid grid-cols-[1fr_1fr] grid-rows-[1fr] fixed gap-2 bottom-5 right-0 z-1000 justify-items-center items-center">
                    <motion.div whileHover={{scale: 1.1}} // ARROW LEFT ←
                                whileTap={{scale: 0.95}}
                                className="col-start-1 row-start-1 bg-[url('/arrow.png')] bg-contain bg-no-repeat rotate-270 w-22 h-22"
                                onClick={() =>
                                    leftClickHandler({posX, setPosX, setRotate, setCollectedCoins, figureRef, coinsPositions, obstaclesPositions, scrollerRef, coinsRefs, NUM_OF_ROWS})}>
                    </motion.div>
                    <motion.div whileHover={{scale: 1.1}} // ARROW RIGHT →
                                whileTap={{scale: 0.95}}
                                className="col-start-2 row-start-1 bg-[url('/arrow.png')] bg-contain bg-no-repeat rotate-90 w-22 h-22"
                                onClick={() =>
                                    rightClickHandler({posX, setPosX, setRotate, setCollectedCoins, figureRef, coinsPositions, obstaclesPositions, scrollerRef, coinsRefs, NUM_OF_ROWS})}>
                    </motion.div>
                </div>
            </>
            :
            <div className="w-[220px] h-44 pb-6 grid grid-cols-[1fr_1fr_1fr] grid-rows-[1fr_1fr] gap-2 fixed bottom-5 right-5 z-1000">
                <motion.div whileHover={{scale: 1.1}} // ARROW UP ↑
                            whileTap={{scale: 0.95}}
                            className="col-start-2 row-start-1 bg-[url('/arrow.png')] bg-contain bg-no-repeat"
                            onClick={() =>
                                upClickHandler({scrollerRef, setRotate, setCollectedCoins, figureRef, coinsPositions, obstaclesPositions, coinsRefs, posX, NUM_OF_ROWS})}>
                </motion.div>
                <motion.div whileHover={{scale: 1.1}} // ARROW LEFT ←
                            whileTap={{scale: 0.95}}
                            className="col-start-1 row-start-2 bg-[url('/arrow.png')] bg-contain bg-no-repeat rotate-270"
                            onClick={() =>
                                leftClickHandler({posX, setPosX, setRotate, setCollectedCoins, figureRef, coinsPositions, obstaclesPositions, scrollerRef, coinsRefs, NUM_OF_ROWS})}>
                </motion.div>
                <motion.div whileHover={{scale: 1.1}} // ARROW DOWN ↓
                            whileTap={{scale: 0.95}}
                            className="col-start-2 row-start-2 bg-[url('/arrow.png')] bg-contain bg-no-repeat rotate-180 mb-1"
                            onClick={() =>
                                downClickHandler({scrollerRef, setRotate, setCollectedCoins, figureRef, coinsPositions, obstaclesPositions, coinsRefs, posX, NUM_OF_ROWS})}>
                </motion.div>
                <motion.div whileHover={{scale: 1.1}} // ARROW RIGHT →
                            whileTap={{scale: 0.95}}
                            className="col-start-3 row-start-2 bg-[url('/arrow.png')] bg-contain bg-no-repeat rotate-90"
                            onClick={() =>
                                rightClickHandler({posX, setPosX, setRotate, setCollectedCoins, figureRef, coinsPositions, obstaclesPositions, scrollerRef, coinsRefs, NUM_OF_ROWS})}>
                </motion.div>
                <motion.div className="absolute bottom-0 font-bold w-full text-center">or use WASD
                </motion.div>
            </div>


    )
}