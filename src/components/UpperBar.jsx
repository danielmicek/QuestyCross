import {ACTIVE_AREA, SQUARE_SIZE} from "./shared/constants.jsx";
import CustomButton from "./CustomButton.jsx";

export default function UpperBar({collectedCoins, exitHandler, setIsExitPopupVisible}) {
    return (
        <div className="w-full h-[60px] absolute top-0 z-2000 justify-center flex">
            <div className="h-full justify-around flex items-center bg-white/40 rounded-br-[20px] rounded-bl-[20px]" style={{width: SQUARE_SIZE * ACTIVE_AREA}}>
                <div id = "EXIT_BUTTON" className= "rounded-full" onClick={() => exitHandler(setIsExitPopupVisible)}>
                    <CustomButton text="Exit"/>
                </div>

                <div id = "COLLECTED_COINS" className= "rounded-full font-bold text-lg text-shadow-lg">
                    collected coins: {collectedCoins}
                </div>
            </div>
        </div>
    )
}