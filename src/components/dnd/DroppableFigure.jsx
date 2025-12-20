import React from 'react';
import {useDroppable} from '@dnd-kit/core';
import { motion } from "framer-motion"

function getEquippedFigure(figures){
    for(let figure of figures){
        if(figure.equipped) return figure
    }
}

const FIGURE_WIDTH = 90


export default function DroppableFigure({NUM_OF_ROWS, posX, rotate, SQUARE_SIZE}) {
    let figures = JSON.parse(localStorage.getItem("figures"))
    let equippedFigure = getEquippedFigure(figures)
    const {setNodeRef: setFirstDroppableRef} = useDroppable({id: 'droppable_skibidi_id'});

    return (
        <div id = "FIGURE_CONTAINER" className="absolute" ref={setFirstDroppableRef}>
            <motion.div id = "FIGURE" className="absolute w-[120px] h-[100px] bg-[url('/figure1_from_top.png')] bg-center bg-cover"

                        style={{
                            backgroundImage: `url(${equippedFigure.imageFromTop})`,
                            transform: `rotate(${rotate}deg)`,
                            left: posX * SQUARE_SIZE - FIGURE_WIDTH / 2,
                            bottom: 150,
                            transition: "all 200ms ease",
                            width: `${FIGURE_WIDTH}px`}}
                        animate={{rotate}}
                        transition={{ duration: 0.02, ease: "easeOut" }}>
            </motion.div>
        </div>
    );
}
