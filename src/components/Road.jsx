import { motion } from "framer-motion"
import {useEffect, useRef, useState} from "react";


function rand(min, max) {
    return Math.random() * (max - min) + min;
}


export default function Road({rowsFromTop, ROW_HEIGHT}) {
    const [cars1, setCars1] = useState([]);
    const [cars2, setCars2] = useState([]);
    const carId1 = useRef(0)
    const carId2= useRef(0)



    useEffect(() => {
        let alive = true; // kvoli tomu, aby pri unmounte komponentu nevzniklo viacero timeoutov
        let timeoutId;

        function spawnCar() {
            if(!alive) return
            const spawnRate1 = Math.floor(rand(500, 2200));
            setCars1(cars1 => [...cars1, ++carId1.current]);
            setCars2(cars2 => [...cars2, ++carId2.current]);

            timeoutId = setTimeout(spawnCar, spawnRate1)
        }
        spawnCar();

        return () => { alive = false; clearTimeout(timeoutId); };
    }, []);

    return (
        <>
            <div className="road absolute w-full h-30 border-amber-700 border-2 bg-[url('/road.png')] bg-center bg-cover overflow-hidden" style={{gridRowStart: rowsFromTop}}>
                {cars1.map(car => (
                    <motion.div key ={car} className="bg-[url('/red_car.png')] bg-contain bg-no-repeat w-25 h-25 absolute bottom-[42px] left-0 z-10"
                                initial={{x: "-10vw"}}
                                animate={{x: "100vw"}}
                                transition={{ duration: 5, ease: "linear" }}
                                onAnimationComplete={() => setCars1((prev) => prev.filter((c) => c !== car))}>
                    </motion.div>
                ))}

                {cars2.map(car => (
                    <motion.div key ={car} className="bg-[url('/red_car.png')] bg-contain bg-no-repeat w-15 h-15 md:w-25 md:h-25 absolute top-[calc(50%-20px)] left-0 z-10"
                                initial={{x: "-10vw"}}
                                animate={{x: "100vw"}}
                                transition={{ duration: 7, ease: "linear" }}
                                onAnimationComplete={() => setCars2((prev) => prev.filter((c) => c !== car))}>
                    </motion.div>
                ))}

            </div>
        </>

    )
}