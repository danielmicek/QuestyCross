import React from 'react';
import {useDroppable} from '@dnd-kit/core';
import { motion } from "framer-motion"

function getEquippedFigure(figures){
    for(let figure of figures){
        if(figure.equipped) return figure
    }
}

const FIGURE_WIDTH = 90
const COLUMN_WIDTH = window.innerWidth / 21

export default function DroppableFigure({NUM_OF_ROWS, ROW_HEIGHT, posX, rotate}) {
    let figures = JSON.parse(localStorage.getItem("figures"))
    let equippedFigure = getEquippedFigure(figures)
    const {setNodeRef: setFirstDroppableRef} = useDroppable({id: 'droppable_skibidi_id'});

    return (
        <div id = "FIGURE_CONTAINER" className="inset-0 absolute" ref={setFirstDroppableRef}>
            <motion.div id = "FIGURE" className="absolute w-[120px] h-[100px] bg-[url('/figure1_from_top.png')] bg-center bg-cover"

                        style={{
                            backgroundImage: `url(${equippedFigure.imageFromTop})`,
                            transform: `rotate(${rotate}deg)`,
                            left: posX * COLUMN_WIDTH - FIGURE_WIDTH / 2,
                            top: (NUM_OF_ROWS - 15) * ROW_HEIGHT,
                            transition: "all 200ms ease",
                            width: `${FIGURE_WIDTH}px`}}
                        animate={{rotate}}
                        transition={{ duration: 0.02, ease: "easeOut" }}>
            </motion.div>
        </div>
    );
}
