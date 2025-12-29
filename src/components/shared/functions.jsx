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

export function getCurrentLevel(levels, selectedLevel = null, currentLevelIndex){
    if (selectedLevel !== null) {
        return levels.find(level => levelIdDecryptor(level.id) === selectedLevel)
    }

    return levels[currentLevelIndex]
}

export function getRandomElement(array){
    return array[Math.floor(Math.random()*array.length)];
}

export function calculateTime(totalTime, playersTime){
    const actualTime = totalTime - playersTime
    const minutes = Math.floor(actualTime / 60);
    const seconds = actualTime % 60;
    return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
}

export function calculateBestTime(bestTime){
    const minutes = Math.floor(bestTime / 60);
    const seconds = bestTime % 60;
    return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
}

// dohodnute pravidlo -> levelId je predposledne cislo daneho id, ktore passujeme ako int
export function levelIdDecryptor(id){
    let idString = id.toString()
    return parseInt(idString[idString.length - 2])
}

// ziska index aktualneho levelu podla levelId
export function getCurrentLevelIndex(selectedLevelId){
    const levels = JSON.parse(localStorage.getItem("levels"))
    if(selectedLevelId){
        return levels.findIndex(level => levelIdDecryptor(level.id) === selectedLevelId)
    }
    return parseInt(localStorage.getItem("currentLevelIndex"))
}
