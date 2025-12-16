import CustomButton from "../components/CustomButton.jsx";
import {Link} from "react-router-dom";
import { motion } from "motion/react"
import SwiperComponent from "../components/SwiperComponent.jsx";
import {toast, Toaster} from "react-hot-toast";


import {useState} from "react";


export default function Shop(){
    const [figures, setFigures] = useState(JSON.parse(localStorage.getItem("figures")))
    const [coins, setCoins] = useState(parseInt(localStorage.getItem("coins")))

    return(
        <div className="w-full min-h-screen flex flex-col overflow-hidden bg-linear-to-tr from-[#2A7B9B] via-[#57C785] to-[#EDDD53]">
            <div>
                <Toaster
                    position="bottom-center"
                    reverseOrder={false}
                />
            </div>
            <motion.div id = "EXIT_BUTTON" className= "absolute rounded-full top-2 left-2 z-999" initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.3}}}>
                <Link to = "/" className="buttonLink">
                    <CustomButton text="Exit Shop"/>
                </Link>
            </motion.div>
            <motion.h1 id = "SHOPT_TITLE" className="w-screen text-4xl font-bold pt-3 text-center" initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.3}}}>Shop</motion.h1>
            <motion.h1 id = "COINS" className="w-screen text-2xl font-bold text-yellow-300  text-center ">{coins} coins</motion.h1>



            <div className= "w-full flex-1 flex justify-center items-center">
                <SwiperComponent
                    items = {figures}
                    setItems = {setFigures}
                    coins = {coins}
                    setCoins = {setCoins}
                    baseWidth={800}
                    autoplay={false}
                    autoplayDelay={3000}
                    pauseOnHover={true}
                    loop={true}
                    round={false}
                />
            </div>

        </div>
    )
}