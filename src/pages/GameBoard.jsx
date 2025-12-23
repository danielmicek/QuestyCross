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
import {calculateGridLocationFromPixels, getCurrentLevel} from "../components/shared/functions.jsx";
import NoAccessAreaComponent from "../components/NoAccessAreaComponent.jsx";
import FinishLine from "../components/FinishLine.jsx";
import {NUM_OF_COLUMNS, SQUARE_SIZE, ACTIVE_AREA, NO_ACCESS_AREA} from "../components/shared/constants.jsx";


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

function deathHandler(setDeathModalVisible){
    setDeathModalVisible(prev => !prev)
}

function getAllOwnedAbilities(abilities){
    return abilities.filter(ability => ability.owned > 0).length
}




function detectCollision(carRef, figureRef, posX, SQUARE_SIZE, scrollerRef, CURRENT_LEVEL) {
    const figureX_px = posX
    const figure_grid_position = calculateGridLocationFromPixels(figureX_px, scrollerRef);
    if (!CURRENT_LEVEL.roadsPositions.some(roadY => roadY === figure_grid_position.y_grid || roadY + 1 === figure_grid_position.y_grid)) return false;
    for (const car of Object.values(carRef.current)) {
        if (car.y !== Math.floor(figure_grid_position.y_grid) && car.y !== Math.ceil(figure_grid_position.y_grid)) continue;
        if (
            //Pevne hodnoty co priratavame su vyska a sirka figurky a aut,
            //menime ich kvoli lepsim hitboxom (obidva objekte su default 1x1 stvorecek)
            car.x < figure_grid_position.x_grid + 0.3 &&
            car.x + 1.5 > figure_grid_position.x_grid &&
            car.y < figure_grid_position.y_grid + 0.5 &&
            car.y + 0.5 > figure_grid_position.y_grid
        ) {
            console.log("collision detected!");
            return true;
        }
    }
    return false;
}



// pri vyplnani NO_ACCESS_AREA vynechame tie riadky, na ktorych je Road
function isRoadOnPosition(roadsPositions, y){
    for(let road of roadsPositions){
        if(road === y || road === y - 1) return true
    }
    return false
}

function createNoAccessArea(NO_ACCESS_AREA, SQUARE_SIZE, NUM_OF_ROWS, NUM_OF_COLUMNS, roadsPositions){
    const array = []
    for(let y = 11; y <= NUM_OF_ROWS; y++){  // zaciname na 11, pretoze FinishLine ma vysku 10 * SQUARE_SIZE
        if(!isRoadOnPosition(roadsPositions, y)){
            // vyplnanie stlpcov zlava
            for(let x = 0; x < NO_ACCESS_AREA; x++){
                array.push(<NoAccessAreaComponent SQUARE_SIZE={SQUARE_SIZE} NO_ACCESS_AREA={NO_ACCESS_AREA} rowsFromTop={y} colsFromSide={x}/>)
            }
            // vyplnanie stlpcov zprava
            for(let x = 0; x < NO_ACCESS_AREA; x++){
                array.push(<NoAccessAreaComponent SQUARE_SIZE={SQUARE_SIZE} NO_ACCESS_AREA={NO_ACCESS_AREA} rowsFromTop={y} colsFromSide={NUM_OF_COLUMNS - x}/>)
            }
        }
    }
    return array
}

// WORLD_CONTAINER je v podstate tvoja obrazovka, nema overflow, je to teda len to co sa mesti na obrazovku
// WORLD_SCROLLER je "kamera" nad svetom, je to div so scrollbarom
// WORLD je samotny gameboard - zelena trava s cestami a prekazkami -> je vacsia ako WORLD_SCROLLER, prave preto ma WORLD_SCROLLER scrollbar
// posuvanie dopredu a dozadu funguje tak, ze sa posuva iba pohlad na WORLD (teda WORLD_SCROLLER)
// posuvanie dolava a doprava posuva samotneho panacika
// DraggableAbility a DroppableFigure su schvalne ako externe komponenty, pretoze Dnd kniznica to vyzaduje - hooky musia byt vo vnutri DndContext
export default function GameBoard() {


    const scrollerRef = useRef(null);
    const carPostitionRef = useRef({});
    const figurePositionRef = useRef({});
    const [posX, setPosX] = useState((NUM_OF_COLUMNS + 1) / 2);
    const [rotate, setRotate] = useState(0);
    const [isExitPopupVisible, setIsExitPopupVisible] = useState(false);
    const [isDeathModalVisible, setIsDeathModalVisible] = useState(false);
    const [abilities, setAbilities] = useState(JSON.parse(localStorage.getItem("abilities")))
    const [levels, setLevels] = useState(JSON.parse(localStorage.getItem("levels")))
    const [collectedCoins, setCollectedCoins] = useState(0);                      // pocet minci ktore hrac zbiera na mape
    const coinsRefs = useRef([])                                             // referencia na vsetky mince na mape -> sluzi na odstranenie mince z mapy po collectnuti


    const CURRENT_LEVEL = getCurrentLevel(levels)                                                   // aktualny level, ktory je vykresleny
    const NUM_OF_ROWS = CURRENT_LEVEL.rowsCount
    const roadsPositions = CURRENT_LEVEL.roadsPositions                                              // pole pozicii vsetkych ciest v aktualnom leveli

    useEffect(() => { // scroll uplne dole pri prvom nacitani
        scrollerRef.current.scrollTo({
            top: 100000,
            behavior: "smooth"
        })
    }, []);

    useEffect(() => {
        let animationId;

        const checkCollisions = () => {
            const collision = detectCollision(carPostitionRef,figurePositionRef,posX, SQUARE_SIZE, scrollerRef,CURRENT_LEVEL);

            if (collision) {
                setIsDeathModalVisible(true);
                return;
            }
            animationId = requestAnimationFrame(checkCollisions);
        };

        checkCollisions();

        return () => cancelAnimationFrame(animationId);
    }, [posX]);

    return (
        <>
            <Toaster position="top-center" reverseOrder={false}/>
            <Movement posX={posX}
                      setPosX={setPosX}
                      setRotate={setRotate}
                      scrollerRef = {scrollerRef}
                      NUM_OF_ROWS = {NUM_OF_ROWS}
                      setCollectedCoins = {setCollectedCoins}
                      figureRef = {figurePositionRef}
                      coinsPositions = {CURRENT_LEVEL.coinsPositions}
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

                {isDeathModalVisible && <motion.div id="START_GAME_POPUP" initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.1}}}
                                                   className="border-2 fixed m-0 top-1/2 left-1/2 -translate-x-1/2 transition-transform -translate-y-1/2 rounded-2xl w-[370px] overflow-hidden z-999">
                    <div>
                        <h3 className="font-bold text-2xl text-center bg-yellow-300 p-2 "> Are you sure you want to leave?</h3>
                        <div>
                            <Link to = "/" className="buttonLink">
                                <motion.button id = "YES_BUTTON" className="bg-black text-white font-bold w-full h-16 hover:bg-gray-600 border-b-yellow-300 border-b-2"
                                               onClick={() => deathHandler(setIsDeathModalVisible)}>Yes
                                </motion.button>
                            </Link>

                            <motion.button id = "NO_BUTTON" className="bg-black text-white font-bold w-full h-16 hover:bg-gray-600"
                                           onClick={() => deathHandler(setIsDeathModalVisible)}>No
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
                        <FinishLine SQUARE_SIZE={SQUARE_SIZE}/>
                        {createNoAccessArea(NO_ACCESS_AREA, SQUARE_SIZE, NUM_OF_ROWS, NUM_OF_COLUMNS, roadsPositions).map(singleComponent => singleComponent)}

                        {/*V tomto pripade akceptovatelne pouzit indexy ako keys*/}
                        <Road rowsFromTop={35} carPositionRef={carPostitionRef}/>
                        {CURRENT_LEVEL.roadsPositions.map((road, index) => (<Road rowsFromTop={road} carPositionRef={carPostitionRef} key={index}/>))}

                        {CURRENT_LEVEL.coinsPositions.map((coin, i) => (<Coin positionFromLeft = {coin.x + NO_ACCESS_AREA} positionFromTop={coin.y} key={coin.x + coin.y} SQUARE_SIZE={SQUARE_SIZE} ref={el => coinsRefs.current[i] = el}/>))}
                    </div>
                </div>

                <DndContext onDragEnd={e => handleDragEnd(e, abilities, setAbilities)}>
                    <motion.div id = "ABILITIES_CONTAINER" className= "w-[100px] z-999 absolute flex flex-col top-0 right-4" style={{ height: `${getAllOwnedAbilities(abilities) * 62}px` }}> {/*TODO zmenit right-4 na right-0 ked odstranis scrollbar !!!*/}
                        {abilities.map(ability =>
                            ability.owned > 0 && (<DraggableAbility ability={ability} key={ability.id}/>)
                        )}
                    </motion.div>d

                    <DroppableFigure posX={posX} rotate={rotate} SQUARE_SIZE = {SQUARE_SIZE} NUM_OF_COLUMNS = {NUM_OF_COLUMNS} ref = {figurePositionRef}/>
                </DndContext>
            </div>
        </>
    )
}