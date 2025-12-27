import {motion} from "framer-motion";
import {ACTIVE_AREA, SQUARE_SIZE} from "./shared/constants.jsx";
import {Link} from "react-router-dom";
import CustomButton from "./CustomButton.jsx";
import {useReactToPrint} from "react-to-print";
import {useEffect, useRef} from "react";

export default function RulesModal({ setIsRulesVisible, isRulesVisible }) {
    const contentRef = useRef(null);
    const modalRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef });
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches; // zistime, ci sme na dotykovom zariadeni alebo pc

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setIsRulesVisible(false);
            }
        };

        if (isRulesVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isRulesVisible,setIsRulesVisible]);

    return (
        <>
            <div className="fixed inset-0 backdrop-blur-md bg-black/30 pointer-events-auto z-1003"></div>
            <motion.div className="bg-white border-3 fixed m-0 p-3 top-1/2 left-1/2 -translate-x-1/2 transition-transform -translate-y-1/2 rounded-[20px] overflow-hidden z-1004 justify-center flex flex-col"
                        initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.1}}} ref={modalRef}>
                <div ref={contentRef}>
                    <h1 className="font-bold text-5xl text-center">Rules and game info</h1>
                    <p className=" text-xl text-center mt-2">
                        <strong>Questy Cross</strong> is an arcade game inspired by Crossy Road. Your goal is to deliver the package to the finish
                        point within a time limit while safely avoiding cars and other obstacles.
                        <br/>
                        The game features three difficulty levels:
                    </p>
                    <ul className="text-xl text-center mt-2">
                        <li><strong>Easy</strong> – slower traffic and more time</li>
                        <li><strong>Medium</strong> – balanced difficulty</li>
                        <li><strong>Hard</strong> – fast vehicles and limited time</li>
                    </ul>
                    <p className="text-xl text-center mt-2">
                        During gameplay, you can collect coins.
                        Coins can be spent in the shop to buy
                        and equip character skins, and abilities such as shields and coin multipliers.
                        <br/>
                    </p>
                    <h2 className="font-bold text-xl text-center mt-2">Controls</h2>
                    <p className="text-xl text-center mt-2">
                        {isTouchDevice ? (
                            <>
                                <strong>Mobile</strong>: use the on-screen arrow buttons
                            </>
                        ) : (
                            <>
                                <strong>PC</strong>: use WASD keys or the on-screen arrow buttons
                            </>
                        )}
                    </p>
                </div>
                <div className="flex justify-around mt-5">
                    <Link to = "/" className="buttonLink" onClick={() => setIsRulesVisible(false)}>
                        <CustomButton text="Exit to Menu"/>
                    </Link>
                    <div id = "PLAY_AGAIN_BUTTON" className= "rounded-full" onClick={reactToPrintFn}>
                        <CustomButton text="Print"/>
                    </div>
                </div>
            </motion.div>
        </>
    )
}