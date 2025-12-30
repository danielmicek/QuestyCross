import { SQUARE_SIZE } from "./shared/constants.jsx";
import { motion } from "framer-motion";
import {getRandomElement} from "./shared/functions.jsx";
import {useMemo} from "react";

const SPEED_PX_PER_SEC_LANE1 = 300;
const SPEED_PX_PER_SEC_LANE2 = 220;

const cars = [
    `${import.meta.env.BASE_URL}red_car.png`,
    `${import.meta.env.BASE_URL}yellow_car.png`,
    `${import.meta.env.BASE_URL}blue_car.png`,
    `${import.meta.env.BASE_URL}green_car.png`,
];

export default function Car({ car, carPositionRef, setCars, rowsFromTop, onCollisionCheck, firstLane = true, direction}) {
    const startX = -0.1 * window.innerWidth;
    const endX = window.innerWidth;
    const speed = firstLane ? SPEED_PX_PER_SEC_LANE1 : SPEED_PX_PER_SEC_LANE2;
    const duration = (endX - startX) / speed;

    const laneY = firstLane ? rowsFromTop : rowsFromTop + 1;
    const carType = useMemo(() => getRandomElement(cars), []);

    return (
        <motion.div
            className="bg-contain bg-no-repeat absolute left-0 z-10"
            style={{ width: SQUARE_SIZE, height: SQUARE_SIZE, backgroundImage: `url(${carType})`, rotate: direction === "right" ? 180 : 0}}
            initial={{ x: direction === "left" ? startX : endX }}
            animate={{ x: direction === "left" ? endX : startX }}
            transition={{ duration, ease: "linear" }}
            onAnimationComplete={() => {
                setCars((prev) => prev.filter((c) => c !== car));
                delete carPositionRef.current[car];
            }}
            onUpdate={(latest) => {
                carPositionRef.current[car] = {
                    x: latest.x / SQUARE_SIZE,
                    y: laneY,
                };
                onCollisionCheck?.();
            }}
        />
    );
}