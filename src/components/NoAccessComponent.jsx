import {getRandomTree} from "./shared/functions.jsx";

export default function NoAccessComponent({SQUARE_SIZE, colsFromSide, rowsFromTop}) {

    const trees = [
        "/tree1.png"
    ]

    return (
        <div className="z-900 bg-contain bg-no-repeat"
             style = {{
                 backgroundImage: `url(${getRandomTree(trees)})`,
                 height: SQUARE_SIZE,
                 width: SQUARE_SIZE,
                 gridColumnStart: colsFromSide,
                 gridRowStart: rowsFromTop
             }}></div>
    )
}