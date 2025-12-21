

export default function Coin({positionFromLeft, positionFromTop, SQUARE_SIZE, ref}){

    return (
        <div className="outline-2 border-black z-1000 bg-contain bg-no-repeat" ref = {ref}
             style={{
                 backgroundImage: `url('/coin.png')`,
                 gridColumnStart: positionFromLeft,
                 /*marginLeft: `${SQUARE_SIZE/2}px`,
                 marginTop: `${SQUARE_SIZE/2}px`,*/
                 gridRowStart: positionFromTop,
                 width: `${SQUARE_SIZE}px`,
                 height: `${SQUARE_SIZE}px`
             }}>
        </div>
    )
}