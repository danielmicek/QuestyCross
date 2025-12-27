import {getRandomElement} from "./shared/functions.jsx";

const trees = [
    "/tree1.png",
    "/tree2.png",
    "/tree3.png",
]

const cactuses = [
    "/cactus1.png",
    "/cactus2.png",
    "/cactus3.png"
]
const rocksAndSatelites = [
    "/rock1.png",
    "/rock2.png",
    "/rock3.png",
    "/satelite1.png",
    "/satelite2.png"
]

const allObstaclesForEasy = [
    "/tree1.png",
    "/tree2.png",
    "/tree3.png",
    "/wood.png",
    "/box.png",
    "/spikeBall.png",
]

const allObstaclesForMedium = [
    "/cactus1.png",
    "/cactus2.png",
    "/cactus3.png",
    "/skull.png",
    "/bush.png",
    "/spikeBall.png",
    "/cactusAmongRocks.png",

]

const allObstaclesForHard = [
    "/rock1.png",
    "/rock2.png",
    "/rock3.png",
    "/satelite1.png",
    "/satelite2.png",
    "/rover.png",
    "/crater.png",

]

function getNoAccessAreaComponentsBasedOnDifficulty(difficulty){
    switch (difficulty){
        case "easy": return trees
        case "medium": return cactuses
        case "hard": return rocksAndSatelites
    }
}

function getObstaclesBasedOnDifficulty(difficulty){
    switch (difficulty){
        case "easy": return allObstaclesForEasy
        case "medium": return allObstaclesForMedium
        case "hard": return allObstaclesForHard
    }
}

export default function NoAccessComponent({SQUARE_SIZE, colsFromSide, rowsFromTop, activeArea = false, difficulty}) {
    const noAccessAreaComponents = getNoAccessAreaComponentsBasedOnDifficulty(difficulty)
    const obstacles = getObstaclesBasedOnDifficulty(difficulty)

    return (
        <div className="z-900 bg-contain bg-no-repeat"
             style = {{
                 backgroundImage: !activeArea ? `url(${getRandomElement(noAccessAreaComponents)})` : `url(${getRandomElement(obstacles)})`,
                 height: SQUARE_SIZE,
                 width: SQUARE_SIZE,
                 gridColumnStart: colsFromSide,
                 gridRowStart: rowsFromTop
             }}></div>
    )
}