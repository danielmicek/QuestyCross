import Road from "../components/Road.jsx";
import {useEffect, useRef, useState} from "react";
import Movement from "../components/Movement.jsx";
import { motion } from "framer-motion"
import CustomButton from "../components/CustomButton.jsx";
import {Link} from "react-router-dom";
import {DndContext} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
import DraggableAbility from "../components/dnd/DraggableAbility.jsx";
import DroppableFigure from "../components/dnd/DroppableFigure.jsx";
import {toast, Toaster} from "react-hot-toast";
import Coin from "../components/Coin.jsx";
import calculateGridLocationFromPixels from "../components/shared/calculateGridLocationFromPixels.jsx";



function handleDragEnd(event, abilities, setAbilities) {
    const { active, over } = event;

    if (!over) return;

    if (over.id === "droppable_skibidi_id") {
        toast.success('Applied ability: ' + active.id);
        let newAbilities = abilities.map(ability => ability.id === active.id ? {...ability, owned: --ability.owned} : ability)
        setAbilities(newAbilities)
        localStorage.setItem("abilities", JSON.stringify(newAbilities));
    }
}

function exitHandler(setExitPopupVisible){
    setExitPopupVisible(prev => !prev)
    // TODO dorobit stopnutie timera
}

function getAllOwnedAbilities(abilities){
    return abilities.filter(ability => ability.owned > 0).length
}

function getCurrentLevel(levels){
    for(let level of levels){
        if(!level.passed) return level
    }
}

function detectCollision(figureRef, carRef, SQUARE_SIZE) {
    if (figureRef.current.getBoundingClientRect().x > carRef.current.getBoundingClientRect().x + carRef.width ||
        figureRef.current.getBoundingClientRect().x + SQUARE_SIZE < carRef.current.getBoundingClientRect().x ||
        figureRef.current.getBoundingClientRect().y > carRef.current.getBoundingClientRect().y + carRef.height ||
        figureRef.current.getBoundingClientRect().y + SQUARE_SIZE < carRef.current.getBoundingClientRect().y) {
        return false;
    }
    console.log("collision detected!");
    return true;
}

// WORLD_CONTAINER je v podstate tvoja obrazovka, nema overflow, je to teda len to co sa mesti na obrazovku
// WORLD_SCROLLER je "kamera" nad svetom, je to div so scrollbarom
// WORLD je samotny gameboard - zelena trava s cestami a prekazkami -> je vacsia ako WORLD_SCROLLER, prave preto ma WORLD_SCROLLER scrollbar
// posuvanie dopredu a dozadu funguje tak, ze sa posuva iba pohlad na WORLD (teda WORLD_SCROLLER)
// posuvanie dolava a doprava posuva samotneho panacika
// DraggableAbility a DroppableFigure su schvalne ako externe komponenty, pretoze Dnd kniznica to vyzaduje - hooky musia byt vo vnutri DndContext
export default function GameBoard() {
    const NUM_OF_ROWS = JSON.parse(localStorage.getItem("levels"))[0].rowsCount
    const NUM_OF_COLUMNS = 15
    const SQUARE_SIZE = Math.floor(window.innerWidth / NUM_OF_COLUMNS)
    const scrollerRef = useRef(null);
    const carPostition1Ref = useRef({});
    const carPostition2Ref = useRef({});
    const figurePositionRef = useRef({});
    const [posX, setPosX] = useState((NUM_OF_COLUMNS + 1) / 2);
    const [rotate, setRotate] = useState(0);
    const [isExitPopupVisible, setIsExitPopupVisible] = useState(false);
    const [abilities, setAbilities] = useState(JSON.parse(localStorage.getItem("abilities")))
    const [levels, setLevels] = useState(JSON.parse(localStorage.getItem("levels")))
    const [collectedCoins, setCollectedCoins] = useState(0);                      // pocet minci ktore hrac zbiera na mape
    const coinsRefs = useRef([])                                             // referencia na vsetky mince na mape -> sluzi na odstranenie mince z mapy po collectnuti
    const currentLevel = getCurrentLevel(levels)                                                    // aktualny level, ktory je vykresleny
    const figureX_px = posX * SQUARE_SIZE;

    useEffect(() => { // scroll uplne dole pri prvom nacitani
        scrollerRef.current.scrollTo({
            top: 100000,
            behavior: "smooth"
        })
    }, []);

    useEffect(() => {
        let animationId;

        const checkCollisions = () => {
            //console.log(carPostition1Ref.current)
            //detectCollision(figurePositionRef, carPostition1Ref, SQUARE_SIZE);
            //detectCollision(figurePositionRef, carPostition2Ref, SQUARE_SIZE);

            animationId = requestAnimationFrame(checkCollisions);
        };

        checkCollisions();

        return () => cancelAnimationFrame(animationId);
    }, [SQUARE_SIZE]);

    return (
        <>
            <Toaster position="top-center" reverseOrder={false}/>
            <Movement posX={posX}
                      setPosX={setPosX}
                      setRotate={setRotate}
                      scrollerRef = {scrollerRef}
                      SQUARE_SIZE = {SQUARE_SIZE}
                      NUM_OF_COLUMNS = {NUM_OF_COLUMNS}
                      NUM_OF_ROWS = {NUM_OF_ROWS}
                      setCollectedCoins = {setCollectedCoins}
                      figureRef = {figurePositionRef}
                      coinsPositions = {currentLevel.coinsPositions}
                      coinsRefs = {coinsRefs}
            />
            <div id = "WORLD_CONTAINER" className="gameBoardContainer relative w-screen h-screen overflow-hidden">

                {isExitPopupVisible && <motion.div id="START_GAME_POPUP" initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.1}}}
                                                   className="border-2 fixed m-0 top-1/2 left-1/2 -translate-x-1/2 transition-transform -translate-y-1/2 rounded-2xl w-[370px] overflow-hidden z-999">
                    <div>
                        <h3 className="font-bold text-2xl text-center bg-yellow-300 p-2 "> Are you sure you want to leave?</h3>
                        <div>
                            <Link to = "/" className="buttonLink">
                                <motion.button id = "YES_BUTTON" className="bg-black text-white font-bold w-full h-16 hover:bg-gray-600 border-b-yellow-300 border-b-2"
                                               onClick={() => exitHandler(setIsExitPopupVisible)}>Yes
                                </motion.button>
                            </Link>

                            <motion.button id = "NO_BUTTON" className="bg-black text-white font-bold w-full h-16 hover:bg-gray-600"
                                           onClick={() => exitHandler(setIsExitPopupVisible)}>No
                            </motion.button>
                        </div>
                    </div>

                </motion.div>}

                <div id = "EXIT_BUTTON" className= "absolute rounded-full top-2 left-2 z-999" onClick={() => exitHandler(setIsExitPopupVisible)}>
                    <CustomButton text="Exit"/>
                </div>

                <div id = "COLLECTED_COINS" className= "absolute rounded-full top-5 left-70 font-bold text-lg text-shadow-lg z-1005">
                    collected coins: {collectedCoins}
                </div>

                <div id="WORLD_SCROLLER" ref={scrollerRef}
                     className="scroller h-full overflow-y-auto overflow-x-hidden">
                    <div id="WORLD" className="relative w-screen bg-[url('/grass.jpg')] grid"
                         style={{
                             height: `${NUM_OF_ROWS * SQUARE_SIZE}px`,
                             gridTemplateRows: `repeat(${NUM_OF_ROWS},${SQUARE_SIZE}px)`,
                             gridTemplateColumns: `repeat(${NUM_OF_COLUMNS},${SQUARE_SIZE}px)`
                         }}>

                        <Road rowsFromTop={35} SQUARE_SIZE={SQUARE_SIZE} carPosition1Ref={carPostition1Ref} carPosition2Ref={carPostition2Ref}/>

                        {currentLevel.coinsPositions.map((coin, i) => (<Coin positionFromLeft = {coin.x} positionFromTop={coin.y} key={coin.x + coin.y} SQUARE_SIZE={SQUARE_SIZE} ref={el => coinsRefs.current[i] = el}/>))}
                    </div>
                </div>

                <DndContext onDragEnd={e => handleDragEnd(e, abilities, setAbilities)}>
                    <motion.div id = "ABILITIES_CONTAINER" className= "w-[100px] z-999 absolute flex flex-col top-0 right-4" style={{ height: `${getAllOwnedAbilities(abilities) * 62}px` }}> {/*TODO zmenit right-4 na right-0 ked odstranis scrollbar !!!*/}
                        {abilities.map(ability =>
                            ability.owned > 0 && (<DraggableAbility ability={ability} key={ability.id}/>)
                        )}
                    </motion.div>

                    <DroppableFigure posX={posX} rotate={rotate} SQUARE_SIZE = {SQUARE_SIZE} NUM_OF_COLUMNS = {NUM_OF_COLUMNS} ref = {figurePositionRef}/>
                </DndContext>
            </div>
        </>
    )
}