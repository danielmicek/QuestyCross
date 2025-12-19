import CustomButton from "../components/CustomButton.jsx";
import {Link} from "react-router-dom";
import { motion } from "motion/react"
import SwiperComponent from "../components/SwiperComponent.jsx";
import {toast, Toaster} from "react-hot-toast";
import {useState} from "react";


// po kliknuti na button sa zmeni shop z figures na abilities
function showOtherShop(setShowFigures, setShowAbilities){
    setShowFigures(prev => !prev)
    setShowAbilities(prev => !prev)
}

// type je but "figures" alebo "abilities"
function buyHandler(coins, setCoins, item, items, setItems, type){
    console.log("aaa");
    if(coins < item.price) toast.error('Not enough coins!')
    else {
        type === "figure" ? toast.success('New character bought!') : toast.success('New ability bought!')
        let updatedItems = type === "figure" ? items.map(figure => figure.id === item.id ? {...figure, owned: true} : figure) : items.map(ability => ability.id === item.id ? {...ability, owned: ++ability.owned} : ability)
        let newCoins = coins - item.price
        setCoins(newCoins)
        setItems(updatedItems)
        localStorage.setItem(type, JSON.stringify(updatedItems));
        localStorage.setItem("coins", newCoins.toString());
    }
}

export default function Shop(){
    const [figures, setFigures] = useState(JSON.parse(localStorage.getItem("figures")))
    const [abilities, setAbilities] = useState(JSON.parse(localStorage.getItem("abilities")))
    const [coins, setCoins] = useState(parseInt(localStorage.getItem("coins")))
    const [showFigures, setShowFigures] = useState(true)
    const [showAbilities, setShowAbilities] = useState(false)


    return(
        <div className="w-full min-h-screen flex flex-col overflow-hidden bg-linear-to-tr from-[#2A7B9B] via-[#57C785] to-[#EDDD53]">
            <Toaster position="bottom-center" reverseOrder={false}/>

            <motion.div id = "FIGURES_OR_ABILITIES_SHOP_BUTTON" className= "absolute top-2 right-2 z-999 flex gap-1 flex-col md:flex-row text-center" initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.3}}}>
                <div className = "border-2 border-black rounded-[20px] p-1.5 font-bold hover:shadow-xl/30 cursor-pointer text-[14px] md:text-[17px]"
                     style={{ background: showFigures ? "#99a1af" : "none" }}
                     onClick={() => showOtherShop(setShowFigures, setShowAbilities)}>Figures</div>
                <div className = "border-2 border-black rounded-[20px] p-1.5 font-bold  hover:shadow-xl/30 cursor-pointer text-[14px] md:text-[17px]"
                     style={{ background: showAbilities ? "#99a1af" : "none" }}
                     onClick={() => showOtherShop(setShowFigures, setShowAbilities)}>Abilities</div>
            </motion.div>

            <motion.div id = "EXIT_BUTTON" className= "absolute rounded-full top-2 left-2 z-999" initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.3}}}>
                <Link to = "/" className="buttonLink">
                    <CustomButton text="Exit Shop"/>
                </Link>
            </motion.div>
            <motion.h1 id = "SHOPT_TITLE" className="w-screen text-4xl font-bold pt-3 text-center text-shadow-lg" initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.3}}}>Shop</motion.h1>
            <motion.h1 id = "COINS" className="w-screen text-2xl font-bold text-yellow-300 text-center text-shadow-lg" initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.3}}}>{coins} coins</motion.h1>

            {showFigures &&     // ZOBRAZENIE FIGURES SHOPU
                <motion.div className= "w-full flex-1 flex justify-center items-center" initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.3}}}>
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
                        buyHandler = {buyHandler}
                    />
                </motion.div>}

            {showAbilities &&     // ZOBRAZENIE ABILITIES SHOPU
                <motion.div className= "w-full flex-1 flex flex-wrap items-center md:justify-between justify-center px-3 py-4 gap-5" initial={{scale: 0}} animate={{scale: 1, transition: {duration: 0.3}}}>
                    {abilities.map(ability =>
                        <div className="border-white rounded-xl border flex flex-col w-[300px] h-[360px] relative overflow-hidden shadow-2xl hover:scale-105 transition-all justify-center items-center">
                            <img
                                src={ability.image}
                                className="w-[240px] h-[240px] object-cover mb-28"
                                alt={ability.name}
                            />
                            <div className="bg-linear-to-t from-[#EDDD53] to-transparent absolute w-full flex flex-col bottom-0 pb-2 gap-2 h-fit">
                                <h2 className="bottom-15 text-center font-bold text-white">{ability.description}</h2>
                                <div className="bottom-1 text-center font-bold text-white flex items-center justify-around w-full">
                                    <h2 className="text-center font-bold text-lg text-black">price: {ability.price} coins</h2>
                                    <CustomButton text={"Buy"} buyHandler={() => buyHandler(coins, setCoins, ability, abilities, setAbilities, "abilities")}/>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>}
        </div>
    )
}