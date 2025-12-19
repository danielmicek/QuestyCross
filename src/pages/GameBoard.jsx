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


// TODO pocet riadkov levelu zavisi od dlzhy (vysky) levelu, preto to bude uvedene v JSONE daneho levelu a nastavi sa to podal toho

const NUM_OF_ROWS = 50 // TODO zmenit podla JSONu

const ROW_HEIGHT = window.innerHeight / NUM_OF_ROWS

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


// WORLD_CONTAINER je v podstate tvoja obrazovka, nema overflow, je to teda len to co sa mesti na obrazovku
// WORLD_SCROLLER je "kamera" nad svetom, je to div so scrollbarom
// WORLD je samotny gameboard - zelena trava s cestami a prekazkami -> je vacsia ako WORLD_SCROLLER, prave preto ma WORLD_SCROLLER scrollbar
// posuvanie dopredu a dozadu funguje tak, ze sa posuva iba pohlad na WORLD (teda WORLD_SCROLLER)
// posuvanie dolava a doprava posuva samotneho panacika
// DraggableAbility a DroppableFigure su schvalne ako externe komponenty, pretoze Dnd kniznica to vyzaduje - hooky musia byt vo vnutri DndContext
export default function GameBoard() {

    const scrollerRef = useRef();
    const [posX, setPosX] = useState(11);
    const [rotate, setRotate] = useState(0);
    const [isExitPopupVisible, setIsExitPopupVisible] = useState(false);
    const [abilities, setAbilities] = useState(JSON.parse(localStorage.getItem("abilities")))

    useEffect(() => { // scroll uplne dole pri prvom nacitani
        scrollerRef.current.scrollTo({
            top: 100000,
            behavior: "smooth"
        })
    }, []);

    return (
        <>
            <Toaster position="top-center" reverseOrder={false}/>
            <Movement setPosX={setPosX}
                      setRotate={setRotate}
                      scrollerRef = {scrollerRef}
                      ROW_HEIGHT = {ROW_HEIGHT}
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

                <div id="WORLD_SCROLLER" ref={scrollerRef}
                     className="scroller h-full overflow-y-auto overflow-x-hidden scroll-smooth">
                    <div id="WORLD"
                         className="h-[50cm] relative w-screen bg-[url('/grass.jpg')] grid grid-cols-[1fr_repeat(20,1fr)] grid-rows-[repeat(50,1fr)]">
                        <Road rowsFromTop={35}/>
                    </div>
                </div>

                <DndContext onDragEnd={e => handleDragEnd(e, abilities, setAbilities)}>
                    <motion.div id = "ABILITIES_CONTAINER" className= "w-[100px] z-999 absolute flex flex-col top-0 right-4" style={{ height: `${getAllOwnedAbilities(abilities) * 62}px` }}> {/*TODO zmenit right-4 na right-0 ked odstranis scrollbar !!!*/}
                        {abilities.map(ability =>
                                ability.owned > 0 && (<DraggableAbility ability={ability} key={ability.id}/>)
                        )}
                    </motion.div>

                    <DroppableFigure NUM_OF_ROWS={NUM_OF_ROWS} ROW_HEIGHT={ROW_HEIGHT} posX={posX} rotate={rotate}/>
                </DndContext>
            </div>
        </>
    )
}