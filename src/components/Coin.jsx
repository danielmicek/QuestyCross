

export default function Coin({positionFromLeft, positionFromTop, SQUARE_SIZE}){
    console.log(positionFromLeft, positionFromTop);
    return (
        <div className="outline-2 border-black z-1000"
             style={{
                 gridColumnStart: 0,
                 gridRowStart: positionFromTop,
                 width: `${SQUARE_SIZE}px`,
                 height: `${SQUARE_SIZE}px`
             }}>
        </div>
    )
}