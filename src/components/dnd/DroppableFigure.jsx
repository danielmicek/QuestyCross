import React from 'react';
import {useDroppable} from '@dnd-kit/core';
import { motion } from "framer-motion"

function getEquippedFigure(figures){
    for(let figure of figures){
        if(figure.equipped) return figure
    }
}


export default function DroppableFigure({posX, rotate, SQUARE_SIZE, NUM_OF_COLUMNS, figurePositionRef}) {
    let figures = JSON.parse(localStorage.getItem("figures"))
    let equippedFigure = getEquippedFigure(figures)
    const {setNodeRef: setFirstDroppableRef} = useDroppable({id: 'droppable_skibidi_id'});
    const WINDOW_HEIGHT = window.innerHeight
    const NUM_OF_ROWS = Math.floor(WINDOW_HEIGHT / SQUARE_SIZE)
    console.log(NUM_OF_ROWS);

    return (
        <div id = "FIGURE_CONTAINER" className="w-full bottom-0 grid absolute"
             style={{
                 height: `${NUM_OF_ROWS * SQUARE_SIZE}px`,
                 gridTemplateRows: `repeat(${NUM_OF_ROWS}, ${SQUARE_SIZE}px)`,
                 gridTemplateColumns: `repeat(${NUM_OF_COLUMNS}, ${SQUARE_SIZE}px)`
             }}>
            <motion.div id = "FIGURE" className="bg-[url('/figure1_from_top.png')] relative bg-center bg-cover border-2 border-black" ref={setFirstDroppableRef}

                        style={{
                            backgroundImage: `url(${equippedFigure.imageFromTop})`,
                            transform: `rotate(${rotate}deg)`,
                            gridColumnStart: posX,
                            gridRowStart: 5,
                            transition: "all 200ms ease",
                            width: SQUARE_SIZE,
                            height: SQUARE_SIZE}}
                        animate={{rotate}}
                        transition={{ duration: 0.02, ease: "easeOut" }}
                        onUpdate={(latest) =>{
                            if (figurePositionRef.current) {
                                figurePositionRef.current = {
                                    x: latest.x,
                                    y: latest.y,
                                }
                                console.log(figurePositionRef.current)
                            }
                        }}
                        >
            </motion.div>
        </div>
    );
}
