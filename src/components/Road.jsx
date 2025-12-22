import { motion } from "framer-motion"
import {useEffect, useRef, useState} from "react";
import {SQUARE_SIZE} from "./shared/constants.jsx";


function rand(min, max) {
    return Math.random() * (max - min) + min;
}


export default function Road({rowsFromTop, carPosition1Ref, carPosition2Ref}) {
    const [cars1, setCars1] = useState([]);
    const [cars2, setCars2] = useState([]);
    const carId1 = useRef(0)
    const carId2= useRef(0)


    useEffect(() => {
        let alive = true; // kvoli tomu, aby pri unmounte komponentu nevzniklo viacero timeoutov
        let timeoutId;

        function spawnCar() {
            if(!alive) return
            const spawnRate1 = Math.floor(rand(1000, 9200)); // hustota premavky
            setCars1(cars1 => [...cars1, ++carId1.current]);
            setCars2(cars2 => [...cars2, ++carId2.current]);

            timeoutId = setTimeout(spawnCar, spawnRate1)
        }
        spawnCar();

        return () => { alive = false; clearTimeout(timeoutId); };
    }, []);

    return (
        <>
            <div className="road grid grid-rows-2 absolute w-full border-amber-700 border-2 bg-[url('/road.png')] bg-center bg-size[100%] overflow-hidden"
                 style={{gridRowStart: rowsFromTop, height: 2*SQUARE_SIZE}}> {/*`${ROW_HEIGHT*2}px`*/}
                <div className="relative h-full flex items-center">
                    {cars1.map(car => (
                        <motion.div key ={car} className="bg-[url('/red_car.png')] bg-contain bg-no-repeat absolute left-0 z-10 border-amber-500 border-2"
                                    style={{
                                        width: SQUARE_SIZE,
                                        height: SQUARE_SIZE
                                    }}
                                    initial={{x: -0.1 * window.innerWidth}}
                                    animate={{x: window.innerWidth}}
                                    transition={{ duration: 5, ease: "linear" }}
                                    onAnimationComplete={() => {
                                        setCars1((prev) => prev.filter((c) => c !== car));
                                        delete carPosition1Ref.current[car];
                                    }}
                                    onUpdate={(latest) =>{
                                        if (carPosition1Ref.current) {
                                            carPosition1Ref.current[car] = {
                                                x:latest.x / SQUARE_SIZE,
                                                y: rowsFromTop,
                                            }
                                        }
                                    }}
                        >
                        </motion.div>
                    ))}
                </div>
                <div className="relative h-full flex items-center">
                    {cars2.map(car => (
                        <motion.div key ={car} className="bg-[url('/red_car.png')] bg-contain bg-no-repeat absolute left-0 z-10 border-amber-500 border-2"
                                    style={{
                                        width: SQUARE_SIZE,
                                        height: SQUARE_SIZE
                                    }}
                                    initial={{x: -0.1 * window.innerWidth, y:0}}
                                    animate={{x: window.innerWidth, y:0}}
                                    transition={{ duration: 7, ease: "linear" }}
                                    onAnimationComplete={() => {
                                        setCars2((prev) => prev.filter((c) => c !== car));
                                        delete carPosition2Ref.current[car];
                                    }}
                                    onUpdate={(latest) =>{
                                        if (carPosition2Ref.current) {
                                            carPosition2Ref.current[car] = {
                                                x: latest.x / SQUARE_SIZE,
                                                y: rowsFromTop + 1,
                                            }
                                        }
                                    }}
                        >
                        </motion.div>
                    ))}
                </div>
            </div>
        </>

    )
}