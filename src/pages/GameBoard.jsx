import Road from "../components/Road.jsx";
import {useEffect, useMemo, useRef, useState} from "react";
import Movement from "../components/Movement.jsx";
import {motion} from "framer-motion"
import {DndContext} from '@dnd-kit/core';
import DraggableAbility from "../components/dnd/DraggableAbility.jsx";
import DroppableFigure from "../components/dnd/DroppableFigure.jsx";
import {toast, Toaster} from "react-hot-toast";
import Coin from "../components/Coin.jsx";
import {calculateGridLocationFromPixels, getCurrentLevel} from "../components/shared/functions.jsx";
import FinishLine from "../components/FinishLine.jsx";
import {NO_ACCESS_AREA, NUM_OF_COLUMNS, SQUARE_SIZE} from "../components/shared/constants.jsx";
import NoAccessComponent from "../components/NoAccessComponent.jsx";
import UpperBar from "../components/UpperBar.jsx";
import AbilityTimer from "../components/AbilityTimer.jsx";
import WinningPopup from "../components/WinningPopup.jsx";
import LosingPopup from "../components/LosingPopup.jsx";
import CommonModal from "../components/CommonModal.jsx";
import {useTimer} from "use-timer";


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

function getBgImageBasedOnDifficulty(difficulty){
    switch(difficulty){
        case "easy": return `url('/grass.jpg')`
        case "medium": return `url('/sand_bg.jpg')`
        case "hard": return `url('/moon_bg.jpg')`
    }
}

function getAllOwnedAbilities(abilities){
    return abilities.filter(ability => ability.owned > 0).length
}

function detectCollision(carRef, figureRef, posX, SQUARE_SIZE, scrollerRef, durability, lastDurabilityCar, setDurability) {
    const figure_grid_position = calculateGridLocationFromPixels(posX, scrollerRef);
    const checkRange = 5;

    for (const [carId,car] of Object.entries(carRef.current)) {
        if (Math.abs(car.y - figure_grid_position.y_grid) > checkRange) continue;
        if (
            //Pevne hodnoty co priratavame su vyska a sirka figurky a aut,
            //menime ich kvoli lepsim hitboxom (obidva objekte su default 1x1 stvorcek)
            car.x + 0.6 < figure_grid_position.x_grid + 0.3 &&
            car.x + 1.5 > figure_grid_position.x_grid &&
            car.y < figure_grid_position.y_grid + 0.75 &&
            car.y + 0.4 > figure_grid_position.y_grid
        ) {

            if (carId === lastDurabilityCar.current) {
                return false;
            }

            if (durability && lastDurabilityCar.current === null) {
                lastDurabilityCar.current = carId;
                setDurability(false);
                return false;
            }

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

function createNoAccessArea(NO_ACCESS_AREA, SQUARE_SIZE, NUM_OF_ROWS, NUM_OF_COLUMNS, roadsPositions, CURRENT_LEVEL){
    const array = []
    for(let y = 11; y <= NUM_OF_ROWS; y++){  // zaciname na 11, pretoze FinishLine ma vysku 10 * SQUARE_SIZE
        if(!isRoadOnPosition(roadsPositions, y)){
            // vyplnanie stlpcov zlava
            for(let x = 0; x < NO_ACCESS_AREA; x++){
                array.push(<NoAccessComponent SQUARE_SIZE={SQUARE_SIZE} NO_ACCESS_AREA={NO_ACCESS_AREA} rowsFromTop={y} colsFromSide={x} difficulty = {CURRENT_LEVEL.difficulty}/>)
            }
            // vyplnanie stlpcov zprava
            for(let x = 0; x < NO_ACCESS_AREA; x++){
                array.push(<NoAccessComponent SQUARE_SIZE={SQUARE_SIZE} NO_ACCESS_AREA={NO_ACCESS_AREA} rowsFromTop={y} colsFromSide={NUM_OF_COLUMNS - x} difficulty = {CURRENT_LEVEL.difficulty}/>)
            }
        }
    }
    return array
}

function incrementNumOfPlays(){
    console.log("incrementing number of plays")
    const levels = JSON.parse(localStorage.getItem("levels"))
    const currentLevel = getCurrentLevel(levels)
    const updatedLevels = levels.map(level => level.id === currentLevel.id ? {...level, numOfPlays: ++level.numOfPlays} : level)
    localStorage.setItem("levels", JSON.stringify(updatedLevels))
    return updatedLevels
}

// WORLD_CONTAINER je v podstate tvoja obrazovka, nema overflow, je to teda len to co sa mesti na obrazovku
// WORLD_SCROLLER je "kamera" nad svetom, je to div so scrollbarom
// WORLD je samotny gameboard - zelena trava s cestami a prekazkami -> je vacsia ako WORLD_SCROLLER, prave preto ma WORLD_SCROLLER scrollbar
// posuvanie dopredu a dozadu funguje tak, ze sa posuva iba pohlad na WORLD (teda WORLD_SCROLLER)
// posuvanie dolava a doprava posuva samotneho panacika
// DraggableAbility a DroppableFigure su schvalne ako externe komponenty, pretoze Dnd kniznica to vyzaduje - hooky musia byt vo vnutri DndContext
export default function GameBoard() {

    const lastDurabilityCarRef = useRef(null);
    const scrollerRef = useRef(null);
    const worldRef = useRef(null);
    const carPostitionRef = useRef({});
    const figurePositionRef = useRef({});
    const [posX, setPosX] = useState((NUM_OF_COLUMNS + 1) / 2);
    const [rotate, setRotate] = useState(0);
    const [isPausePopupVisible, setIsPausePopupVisible] = useState(false);
    const [isLosingPopupVisible, setIsLosingPopupVisible] = useState(false);
    const [isWinningPopupVisible, setIsWinningModalVisible] = useState(false);
    const [abilities, setAbilities] = useState(JSON.parse(localStorage.getItem("abilities")))
    const [coins, setCoins] = useState(() => parseInt(localStorage.getItem("coins")))
    const [coin2x, setCoin2x] = useState(false);
    const [coin3x, setCoin3x] = useState(false);
    const [durability, setDurability] = useState(false);
    const [shield, setShield] = useState(false);
    const [levels] = useState(() => incrementNumOfPlays())
    const [collectedCoins, setCollectedCoins] = useState(0);                      // pocet minci ktore hrac zbiera na mape
    const coinsRefs = useRef([])                                             // referencia na vsetky mince na mape -> sluzi na odstranenie mince z mapy po collectnuti
    const [CURRENT_LEVEL] = useState(() => getCurrentLevel(levels))                      // aktualny level, ktory je vykresleny
    const [NUM_OF_ROWS] = useState(() => CURRENT_LEVEL.rowsCount)
    const [roadsPositions] = useState(() => CURRENT_LEVEL.roadsPositions)               // pole pozicii vsetkych ciest v aktualnom leveli
    const noAccessAreaComponents = useMemo(() => createNoAccessArea(NO_ACCESS_AREA, SQUARE_SIZE, NUM_OF_ROWS, NUM_OF_COLUMNS, roadsPositions, CURRENT_LEVEL), [CURRENT_LEVEL, NUM_OF_ROWS, roadsPositions])
    const activeAreaObstacles = useMemo(() => CURRENT_LEVEL.obstaclesPositions.map((coin, i) => (<NoAccessComponent key = {i} SQUARE_SIZE={SQUARE_SIZE} colsFromSide = {coin.x + NO_ACCESS_AREA} rowsFromTop={coin.y} activeArea ={true} difficulty = {CURRENT_LEVEL.difficulty}/>)), [CURRENT_LEVEL.difficulty, CURRENT_LEVEL.obstaclesPositions])
    const activeAreaCoins = useMemo(() => CURRENT_LEVEL.coinsPositions.map((coin, i) => (<Coin key = {i} positionFromLeft = {coin.x + NO_ACCESS_AREA} positionFromTop={coin.y} SQUARE_SIZE={SQUARE_SIZE} ref={el => coinsRefs.current[i] = el}/>)), [CURRENT_LEVEL.coinsPositions])
    const { time, start, pause} = useTimer({        // timer component, aby sme mohli passnut time field do WinningPopup
        initialTime: CURRENT_LEVEL.time,
        endTime: 0,
        autoStart: true,
        timerType: 'DECREMENTAL',
        onTimeOver: () => setIsLosingPopupVisible(true)
    });

    console.log(CURRENT_LEVEL.id)


    useEffect(() => { // scroll uplne dole pri prvom nacitani
        scrollerRef.current.scrollTo({
            top: Math.floor((CURRENT_LEVEL.rowsCount) * SQUARE_SIZE),
            behavior: "smooth"
        })
    }, []);

    useEffect(() => {
        if (durability) {
            lastDurabilityCarRef.current = null;
        }
    }, [durability]);


    // Callback volame v onUpdate funkcii cesty, cize po kazdej zmene pozicie auta
    const checkCollisionCallback = () => {
        const collision = detectCollision(carPostitionRef, figurePositionRef, posX, SQUARE_SIZE, scrollerRef,durability, lastDurabilityCarRef, setDurability);
        if (collision && !isLosingPopupVisible) {
            if (shield) {
                return;
            }
            setIsLosingPopupVisible(true);
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

                {isPausePopupVisible && <CommonModal setIsPopupVisible = {setIsPausePopupVisible} text = "Game paused" secondaryText ={true}/>}
                {isWinningPopupVisible && <WinningPopup CURRENT_LEVEL = {CURRENT_LEVEL}
                                                        collectedCoins = {collectedCoins}
                                                        coins2x = {coin2x}
                                                        coins3x = {coin3x}
                                                        coins = {coins}
                                                        setCoins = {setCoins}
                                                        time = {time}/>}
                {isLosingPopupVisible && <LosingPopup time={time}/>}


                <UpperBar collectedCoins = {collectedCoins}
                          isPausePopupVisible = {isPausePopupVisible}
                          setIsPausePopupVisible = {setIsPausePopupVisible}
                          isLosingPopupVisible = {isLosingPopupVisible}
                          isWinningPopupVisible = {isWinningPopupVisible}
                          time ={time}
                          start = {start}
                          pause = {pause}/>

                <AbilityTimer isLosingPopupVisible = {isLosingPopupVisible} setShield = {setShield} shield = {shield} />

                <div id="WORLD_SCROLLER" ref={scrollerRef}
                     className="scroller h-full overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div id="WORLD" className="relative w-screen bg-[url('/grass.jpg')] grid" ref = {worldRef}
                         style={{
                             height: `${NUM_OF_ROWS * SQUARE_SIZE}px`,
                             backgroundImage: getBgImageBasedOnDifficulty(CURRENT_LEVEL.difficulty),
                             gridTemplateRows: `repeat(${NUM_OF_ROWS},${SQUARE_SIZE}px)`,
                             gridTemplateColumns: `repeat(${NUM_OF_COLUMNS},${SQUARE_SIZE}px)`
                         }}>
                        <FinishLine SQUARE_SIZE={SQUARE_SIZE}/>
                        {noAccessAreaComponents}

                        {/*V tomto pripade akceptovatelne pouzit indexy ako keys*/}
                        {CURRENT_LEVEL.roadsPositions.map((road, index) => (<Road rowsFromTop={road} carPositionRef={carPostitionRef} key={index} onCollisionCheck={checkCollisionCallback}/>))}

                        {activeAreaCoins}

                        {activeAreaObstacles}
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