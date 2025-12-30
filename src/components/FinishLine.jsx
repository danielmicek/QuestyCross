export default function FinishLine({SQUARE_SIZE}) {
    return(
        <div className="absolute top-0 left-0 w-full bg-contain bg-bottom"
             style={{height: 10*SQUARE_SIZE, backgroundImage: `url(${import.meta.env.BASE_URL}finishLine.png)`}}>

        </div>
    )
}