export default function calculateGridLocationFromPixels(posX, y, SQUARE_SIZE, scrollerRef){
    const x_grid = posX
    const y_grid = scrollerRef.current.scrollTop / SQUARE_SIZE + 6  // vypocitana y-ova pozicia figurky vzhladom na grid -> +6 pretoze v DroppableFigure je gridRowStart: 6
    return {"x_grid": x_grid,                                               // TODO bude to treba zmenit ked budem nastavovat tu hodnotu dynamicky !!!!
        "y_grid": y_grid}
}