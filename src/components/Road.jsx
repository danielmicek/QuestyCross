import {useEffect, useRef, useState} from "react";
import {SQUARE_SIZE} from "./shared/constants.jsx";
import Car from "./Car.jsx";


function rand(min, max) {
    return Math.random() * (max - min) + min;
}

export default function Road({rowsFromTop, carPositionRef,onCollisionCheck}) {
    const [cars1, setCars1] = useState([]);
    const [cars2, setCars2] = useState([]);
    const carId1 = useRef(0)
    const carId2= useRef(0)


    useEffect(() => {
        let alive = true;
        let t1, t2;

        const spawnLane1 = () => {
            if (!alive) return;
            setCars1(prev => [...prev, ++carId1.current]);
            const next = Math.floor(rand(900, 4200));
            t1 = setTimeout(spawnLane1, next);
        };

        const spawnLane2 = () => {
            if (!alive) return;
            setCars2(prev => [...prev, ++carId2.current]);
            const next = Math.floor(rand(1200, 5200));
            t2 = setTimeout(spawnLane2, next);
        };

        // aby nezačali naraz:
        const offset2 = Math.floor(rand(200, 1500));
        spawnLane1();
        t2 = setTimeout(spawnLane2, offset2);

        return () => {
            alive = false;
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    return (
        <>
            <div className="road grid grid-rows-2 absolute w-full bg-[url('/road.png')] bg-center bg-size[100%] overflow-hidden"
                 style={{gridRowStart: rowsFromTop, height: 2*SQUARE_SIZE}}> {/*`${ROW_HEIGHT*2}px`*/}
                <div className="relative h-full flex items-center">
                    {cars1.map(car => (<Car key ={car} car={car} carPositionRef={carPositionRef} setCars={setCars1} rowsFromTop={rowsFromTop} onCollisionCheck={onCollisionCheck}/>))}
                </div>
                <div className="relative h-full flex items-center">
                    {cars2.map(car => (<Car key ={car} car={car} carPositionRef={carPositionRef} setCars={setCars2} rowsFromTop={rowsFromTop} onCollisionCheck={onCollisionCheck} firstLane = {false}/>))}
                </div>
            </div>
        </>

    )
}