import { motion } from "framer-motion"

function rightClickHandler(setPosX, setRotate){
    setPosX(posX => posX === 21 ? posX : posX + 1)
    setRotate(90)
}

function leftClickHandler(setPosX, setRotate){
    setPosX(posX => posX === 1 ? posX : posX - 1)
    setRotate(270)
}

function upClickHandler(scrollerRef, setRotate, ROW_HEIGHT){
    scrollerRef.current.scrollTop -= 4*ROW_HEIGHT
    setRotate(prev => prev === 270 || prev === 360 ? 360 : 0)
}

function downClickHandler(scrollerRef, setRotate, ROW_HEIGHT){
    scrollerRef.current.scrollTop += 4*ROW_HEIGHT
    setRotate(180)
}

export default function Arrows({setPosX, setRotate, scrollerRef, ROW_HEIGHT}){

    return(
        <div className="w-[220px] h-40 grid grid-cols-[1fr_1fr_1fr] grid-rows-[1fr_1fr] gap-2 fixed bottom-5 right-5 z-1000">
            <motion.div whileHover={{ scale: 1.1 }} // ARROW UP ↑
                        whileTap={{ scale: 0.95 }}
                        className="col-start-2 row-start-1 bg-[url('/arrow.png')] bg-contain bg-no-repeat"
                        onClick={() => upClickHandler(scrollerRef, setRotate, ROW_HEIGHT)}>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} // ARROW LEFT ←
                        whileTap={{ scale: 0.95 }}
                        className="col-start-1 row-start-2 bg-[url('/arrow.png')] bg-contain bg-no-repeat rotate-270"
                        onClick={() => leftClickHandler(setPosX, setRotate)}>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} // ARROW DOWN ↓
                        whileTap={{ scale: 0.95 }}
                        className="col-start-2 row-start-2 bg-[url('/arrow.png')] bg-contain bg-no-repeat rotate-180 mb-1"
                        onClick={() => downClickHandler(scrollerRef, setRotate, ROW_HEIGHT)}>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} // ARROW RIGHT →
                        whileTap={{ scale: 0.95 }}
                        className="col-start-3 row-start-2 bg-[url('/arrow.png')] bg-contain bg-no-repeat rotate-90"
                        onClick={() => rightClickHandler(setPosX, setRotate)}>
            </motion.div>
        </div>

    )
}