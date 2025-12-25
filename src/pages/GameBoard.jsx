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
import FinishLine from "../components/FinishLine.jsx";
import {NUM_OF_COLUMNS, SQUARE_SIZE, ACTIVE_AREA, NO_ACCESS_AREA} from "../components/shared/constants.jsx";
import NoAccessComponent from "../components/NoAccessComponent.jsx";
import UpperBar from "../components/UpperBar.jsx";
import AbilityTimer from "../components/AbilityTimer.jsx";
import WinningPopup from "../components/WinningPopup.jsx";
import LosingPopup from "../components/LosingPopup.jsx";
import ExitModal from "../components/ExitModal.jsx";


function handleDragEnd(event, abilities, setAbilities, setCoin2x, setCoin3x, setDurability, setShield) {
    const { active, over } = event;
    console.log(active.id);
    if (!over) return;

    if (over.id === "droppable_skibidi_id") {
        toast.success('Applied ability: ' + active.id);
        let newAbilities = abilities.map(ability => ability.id === active.id ? {...ability, owned: --ability.owned} : ability)
        setAbilities(newAbilities)
        localStorage.setItem("abilities", JSON.stringify(newAbilities));

        // apply the ability
        switch (active.id) {
            case "2x coins": setCoin2x(true);
                break
            case "3x coins": setCoin3x(true);
                break
            case "car durability": setDurability(true);
                break
            case "5s shield": setShield(true);
                break
        }
    }


}

function exitHandler(setExitPopupVisible){
    setExitPopupVisible(prev => !prev)
}

function deathHandler(setDeathModalVisible){
    setDeathModalVisible(prev => !prev)
}

function getAllOwnedAbilities(abilities){
    return abilities.filter(ability => ability.owned > 0).length
}




function detectCollision(carRef, figureRef, posX, SQUARE_SIZE, scrollerRef) {
    const figureX_px = posX
    const figure_grid_position = calculateGridLocationFromPixels(figureX_px, scrollerRef);
    const checkRange = 5;

    for (const car of Object.values(carRef.current)) {
        if (Math.abs(car.y - figure_grid_position.y_grid) > checkRange) continue;
        if (
            //Pevne hodnoty co priratavame su vyska a sirka figurky a aut,
            //menime ich kvoli lepsim hitboxom (obidva objekte su default 1x1 stvorcek)
            car.x + 0.6 < figure_grid_position.x_grid + 0.3 &&
            car.x + 1.5 > figure_grid_position.x_grid &&
            car.y < figure_grid_position.y_grid + 0.75 &&
            car.y + 0.4 > figure_grid_position.y_grid
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
                array.push(<NoAccessComponent SQUARE_SIZE={SQUARE_SIZE} NO_ACCESS_AREA={NO_ACCESS_AREA} rowsFromTop={y} colsFromSide={x}/>)
            }
            // vyplnanie stlpcov zprava
            for(let x = 0; x < NO_ACCESS_AREA; x++){
                array.push(<NoAccessComponent SQUARE_SIZE={SQUARE_SIZE} NO_ACCESS_AREA={NO_ACCESS_AREA} rowsFromTop={y} colsFromSide={NUM_OF_COLUMNS - x}/>)
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
    const worldRef = useRef(null);
    const carPostitionRef = useRef({});
    const figurePositionRef = useRef({});
    const [posX, setPosX] = useState((NUM_OF_COLUMNS + 1) / 2);
    const [rotate, setRotate] = useState(0);
    const [isExitPopupVisible, setIsExitPopupVisible] = useState(false);
    const [isLosingPopupVisible, setIsLosingModalVisible] = useState(false);
    const [isWinningPopupVisible, setIsWinningModalVisible] = useState(false);
    const [abilities, setAbilities] = useState(JSON.parse(localStorage.getItem("abilities")))
    const [coin2x, setCoin2x] = useState(false);
    const [coin3x, setCoin3x] = useState(false);
    const [durability, setDurability] = useState(false);
    const [shield, setShield] = useState(false);
    const levels = JSON.parse(localStorage.getItem("levels"))
    const [collectedCoins, setCollectedCoins] = useState(0);                      // pocet minci ktore hrac zbiera na mape
    const coinsRefs = useRef([])                                             // referencia na vsetky mince na mape -> sluzi na odstranenie mince z mapy po collectnuti
    const counterRef = useRef(null)
    const abilityCounterRef = useRef(null)

    const CURRENT_LEVEL = getCurrentLevel(levels)                                                   // aktualny level, ktory je vykresleny
    const NUM_OF_ROWS = CURRENT_LEVEL.rowsCount
    const roadsPositions = CURRENT_LEVEL.roadsPositions                                              // pole pozicii vsetkych ciest v aktualnom leveli


    useEffect(() => { // scroll uplne dole pri prvom nacitani
        scrollerRef.current.scrollTo({
            top: Math.floor((CURRENT_LEVEL.rowsCount) * SQUARE_SIZE),
            behavior: "smooth"
        })
    }, []);

    // Callback volame v onUpdate funkcii cesty, cize po kazdej zmene pozicie auta
    const checkCollisionCallback = () => {
        const collision = detectCollision(carPostitionRef, figurePositionRef, posX, SQUARE_SIZE, scrollerRef);
        if (collision && !isLosingPopupVisible) {
            if (shield) {
                return;
            }
            setIsLosingModalVisible(true);
        }
    };

    return (
        <>
            <Toaster position="top-left" reverseOrder={false}/>
            <Movement posX={posX}
                      setPosX={setPosX}
                      setRotate={setRotate}
                      scrollerRef = {scrollerRef}
                      NUM_OF_ROWS = {NUM_OF_ROWS}
                      setCollectedCoins = {setCollectedCoins}
                      figureRef = {figurePositionRef}
                      coinsPositions = {CURRENT_LEVEL.coinsPositions}
                      obstaclesPositions = {CURRENT_LEVEL.obstaclesPositions}
                      coinsRefs = {coinsRefs}
                      setIsWinningModalVisible = {setIsWinningModalVisible}
            />
            <div id = "WORLD_CONTAINER" className="gameBoardContainer relative w-screen h-screen overflow-hidden">

                {isExitPopupVisible && <ExitModal setIsExitPopupVisible = {setIsExitPopupVisible}/>}
                {isWinningPopupVisible && <WinningPopup CURRENT_LEVEL={CURRENT_LEVEL} collectedCoins={collectedCoins} coins2x={coin2x} coins3x={coin3x}/>}
                {isLosingPopupVisible && <LosingPopup/>}


                <UpperBar collectedCoins = {collectedCoins}
                          exitHandler = {exitHandler}
                          isExitPopupVisible = {isExitPopupVisible}
                          setIsExitPopupVisible = {setIsExitPopupVisible}
                          CURRENT_LEVEL={CURRENT_LEVEL}/>

                <AbilityTimer isLosingPopupVisible = {isLosingPopupVisible} setShield={setShield} shield={shield} />

                <div id="WORLD_SCROLLER" ref={scrollerRef}
                     className="scroller h-full overflow-y-auto overflow-x-hidden">
                    <div id="WORLD" className="relative w-screen bg-[url('/grass.jpg')] grid" ref = {worldRef}
                         style={{
                             height: `${NUM_OF_ROWS * SQUARE_SIZE}px`,
                             gridTemplateRows: `repeat(${NUM_OF_ROWS},${SQUARE_SIZE}px)`,
                             gridTemplateColumns: `repeat(${NUM_OF_COLUMNS},${SQUARE_SIZE}px)`
                         }}>
                        <FinishLine SQUARE_SIZE={SQUARE_SIZE}/>
                        {createNoAccessArea(NO_ACCESS_AREA, SQUARE_SIZE, NUM_OF_ROWS, NUM_OF_COLUMNS, roadsPositions).map(singleComponent => singleComponent)}

                        {/*V tomto pripade akceptovatelne pouzit indexy ako keys*/}
                        {CURRENT_LEVEL.roadsPositions.map((road, index) => (<Road rowsFromTop={road} carPositionRef={carPostitionRef} key={index} onCollisionCheck={checkCollisionCallback}/>))}

                        {CURRENT_LEVEL.coinsPositions.map((coin, i) => (<Coin positionFromLeft = {coin.x + NO_ACCESS_AREA} positionFromTop={coin.y} SQUARE_SIZE={SQUARE_SIZE} ref={el => coinsRefs.current[i] = el}/>))}

                        {CURRENT_LEVEL.obstaclesPositions.map(coin => (<NoAccessComponent SQUARE_SIZE={SQUARE_SIZE} colsFromSide = {coin.x + NO_ACCESS_AREA} rowsFromTop={coin.y}/>))}
                    </div>
                </div>

                <DndContext onDragEnd={e => handleDragEnd(e, abilities, setAbilities, setCoin2x, setCoin3x, setDurability, setShield)}>
                    <motion.div id = "ABILITIES_CONTAINER" className= "w-[100px] z-1002 absolute flex flex-col right-2" style={{ height: `${getAllOwnedAbilities(abilities) * 62}px`, top: window.innerWidth <= 550 ? "70px" : 0}}> {/*TODO zmenit right-4 na right-0 ked odstranis scrollbar !!!*/}
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