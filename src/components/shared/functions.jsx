import {useEffect} from "react";
import {SQUARE_SIZE} from "./constants.jsx";

export function calculateGridLocationFromPixels(posX, scrollerRef){
    const scrollerHeight_grid = Math.floor(scrollerRef.current.getBoundingClientRect().height / SQUARE_SIZE - 2)
    const x_grid = posX
    const y_grid =  Math.round((scrollerRef.current.scrollTop + SQUARE_SIZE) / SQUARE_SIZE + scrollerHeight_grid)  // vypocitana y-ova pozicia figurky vzhladom na grid -> + SQUARE_SIZE pretoze v DroppableFigure je gridRowStart: SQUARE_ROW
    return {"x_grid": x_grid,
        "y_grid": y_grid}
}

// get the number of columns according to screen width
export function getNumOfColumns(){
    if(window.innerWidth > 1536) return 17;
    if(window.innerWidth > 1024) return 13;
    if(window.innerWidth > 900) return 11;
    if(window.innerWidth > 768) return 9;
    if(window.innerWidth > 550) return 7;
    return 5
}

// vypocita pocet stlpcov ktore budu na kazdej strane not accessible (ohranicenie mapy po stranach)
export function calculateNoAccessArea(NUM_OF_COLUMNS, ACTIVE_AREA){
    if(NUM_OF_COLUMNS === 5) return 0
    return Math.floor((NUM_OF_COLUMNS - ACTIVE_AREA) / 2)
}

export function getCurrentLevel(levels){
    for(let level of levels){
        if(!level.passed) return level
    }
}