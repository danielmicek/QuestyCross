export default function Coin({positionFromLeft, positionFromTop, SQUARE_SIZE, ref}){
    return (
        <div className="outline-2 relative border-black z-900 justify-center items-center flex" ref = {ref}
             style={{
                 gridColumnStart: positionFromLeft,
                 gridRowStart: positionFromTop,
                 width: `${SQUARE_SIZE}px`,
                 height: `${SQUARE_SIZE}px`
             }}>
            <img src={'/coin.png'}  alt="coin_icon" className="md:w-10 md:h-10 w-7 h-7"/>
        </div>
    )
}