import Road from "../components/Road.jsx";
import {useEffect, useRef, useState} from "react";
import Arrows from "../components/Arrows.jsx";
import { motion } from "framer-motion"
import CustomButton from "../components/CustomButton.jsx";
import {Link} from "react-router-dom";

// TODO pocet riadkov levelu zavisi od dlzhy (vysky) levelu, preto to bude uvedene v JSONE daneho levelu a nastavi sa to podal toho

const NUM_OF_ROWS = 50 // TODO zmenit podla JSONu
const FIGURE_WIDTH = 90
const COLUMN_WIDTH = window.innerWidth / 21
const ROW_HEIGHT = window.innerHeight / NUM_OF_ROWS



function exitHandler(setExitPopupVisible){
    setExitPopupVisible(prev => !prev)
    // TODO dorobit stopnutie timera
}



// WORLD_CONTAINER je v podstate tvoja obrazovka, nema overflow, je to teda len to co sa mesti na obrazovku
// WORLD_SCROLLER je "kamera" nad svetom, je to div so scrollbarom
// WORLD je samotny gameboard - zelena trava s cestami a prekazkami -> je vacsia ako WORLD_SCROLLER, prave preto ma WORLD_SCROLLER scrollbar
// posuvanie dopredu a dozadu funguje tak, ze sa posuva iba pohlad na WORLD (teda WORLD_SCROLLER)
// posuvanie dolava a doprava posuva samotneho panacika
export default function GameBoard() {

    const figureRef = useRef();
    const scrollerRef = useRef();
    const [posX, setPosX] = useState(11);
    const [rotate, setRotate] = useState(0);
    const [isExitPopupVisible, setIsExitPopupVisible] = useState(false);
    console.log(posX, ROW_HEIGHT, COLUMN_WIDTH);


    useEffect(() => { // scroll uplne dole pri prvom nacitani
        scrollerRef.current.scrollTo({
            top: 100000,
            behavior: "smooth"
        })
    }, []);

    return (
        <>
            <Arrows setPosX={setPosX}
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

                <div className= "absolute rounded-full top-2 left-2 z-999" onClick={() => exitHandler(setIsExitPopupVisible)}>
                    <CustomButton text="Exit"/>
                </div>

                <div id="WORLD_SCROLLER" ref={scrollerRef}
                     className="scroller h-full overflow-y-auto overflow-x-hidden scroll-smooth">
                    <div id="WORLD"
                         className="h-[50cm] relative w-screen bg-[url('/grass.jpg')] grid grid-cols-[1fr_repeat(20,1fr)] grid-rows-[repeat(50,1fr)]">
                        <Road rowsFromTop={35}/>
                    </div>
                </div>

                <div id = "FIGURE_CONTAINER" className="inset-0 absolute pointer-events-none">
                    <motion.div id = "FIGURE" ref = {figureRef} className="absolute w-[120px] h-[100px] bg-[url('/figure1_from_top.png')] bg-center bg-cover"
                                style={{
                                    transform: `rotate(${rotate}deg)`,
                                    left: posX * COLUMN_WIDTH - FIGURE_WIDTH / 2,
                                    top: (NUM_OF_ROWS - 15) * ROW_HEIGHT,
                                    transition: "all 200ms ease",
                                    width: `${FIGURE_WIDTH}px`}}
                                animate={{rotate}}
                                transition={{ duration: 0.02, ease: "easeOut" }}>
                    </motion.div>
                </div>
            </div>
        </>
    )
}