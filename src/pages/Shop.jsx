import CustomButton from "../components/CustomButton.jsx";
import {Link} from "react-router-dom";
import { motion } from "motion/react"


export default function Shop(){
    return(
        <>
            <motion.h1 className="w-screen text-4xl font-bold pt-3 text-center" initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.3}}}>Shop</motion.h1>
            <motion.div className= "absolute rounded-full top-2 left-2 z-999" initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.3}}}>
                <Link to = "/" className="buttonLink">
                    <CustomButton text="Exit Shop"/>
                </Link>
            </motion.div>
        </>
    )
}