import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import CustomButton from "./CustomButton.jsx";
import {toasterFunction} from "./sharedMethods.jsx";


// tato funkcia meni fajku pri equipped
// ak to predtym bolo equipped a kliknes, nic sa nestane, pretoze vzdy musi byt nieco equipped
// ak to nie je equipped tak to equippnes, teda zafajkneš, a ostatne odfajkneš, lebo equipped moze byt len 1
function equipButtonHandler(items, currentItem, setItems){
    let updatedItems = items.map(item => item.id === currentItem.id ?
        (item.equipped ? item : {...item, equipped: !item.equipped})
        :
        {...item, equipped: false})
    setItems(updatedItems)
    localStorage.setItem("figures", JSON.stringify(updatedItems));
}


function buyButtonHandler(coins, setCoins, item, items, setItems){
    if(coins < item.price) toasterFunction('Not enough coins!', "error")
    else {
        toasterFunction('New character bought!', "success")
        let updatedItems = items.map(figure => figure.id === item.id ? {...figure, owned: true} : figure)
        let newCoins = coins - item.price
        setCoins(newCoins)
        setItems(updatedItems)
        localStorage.setItem("figures", JSON.stringify(updatedItems));
        localStorage.setItem("coins", newCoins.toString());
    }
}

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring', stiffness: 300, damping: 30 };

function CarouselItem({
                          items,
                          setItems,
                          coins,
                          setCoins,
                          item,
                          index,
                          itemWidth,
                          round,
                          trackItemOffset,
                          x,
                          transition
                      }) {
    const range = [
        -(index + 1) * trackItemOffset,
        -index * trackItemOffset,
        -(index - 1) * trackItemOffset,
    ];
    const outputRange = [45, 0, -45];
    const rotateY = useTransform(x, range, outputRange, { clamp: false });

    const scale = useTransform(x, range, [0.85, 1, 0.85], { clamp: false });

    return (
        <motion.div

            className={`relative shrink-0 flex flex-col ${
                round
                    ? "items-center justify-center text-center bg-[#060010] border-0"
                    : "items-start justify-between border border-white bg-contain bg-no-repeat bg-center rounded-xl w-full h-[95%]"
            } overflow-hidden cursor-grab active:cursor-grabbing`}
            style={{
                width: itemWidth,
                rotateY,
                scale,
                backgroundImage: `url(${item.image})`,
                ...(round && { borderRadius: "50%" }),
            }}
            transition={transition}
        >
            <div id="VIEW_FROM_TOP" className="w-[2.5cm] h-[2.5cm] border-1 border-black absolute top-2 right-2 rounded-3xl bg-[url('/grass.jpg')] bg-no-repeat bg-cover flex justify-center items-center">
                <div className="w-[2cm] h-[2cm] absolute bg-no-repeat bg-cover" style={{backgroundImage: `url(${item.imageFromTop})`}}></div>
            </div>
            <div id = "FIGURE_INFO_CONTAINER" className="p-5 absolute bottom-0 bg-linear-to-t from-[#EDDD53] to-transparent w-full select-none">
                <div className="mb-1 font-black text-2xl text-white">{item.name}</div>


                {!item.owned ? (
                    <div className="flex flex-row justify-between gap-2 items-center ">
                        <p className="text-lg font-bold text-black">price: {item.price} coins</p>
                        <CustomButton
                            text="Buy"
                            buyHandler={() => buyButtonHandler(coins, setCoins, item, items, setItems)}
                        />
                    </div>
                ) : (
                    <div id = "FIGURE_INFO_CONTAINER_INNER" className="flex flex-row justify-between gap-8 items-center">
                        <p id = "OWNED_TEXT" className="text-lg font-bold text-[#2A7B9B]">Owned</p>
                        <div id="EQUIP_BUTTON" className="rounded-full font-bold text-white cursor-pointer flex justify-center items-center p-2"
                        style={{
                            background: item.equipped ? "#2A7B9B" : "gray",
                        }}
                             onClick={() => equipButtonHandler(items, item, setItems)}
                        >{item.equipped ? "equipped ✓" : "equip"}</div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default function SwiperComponent({
                                            items,
                                            setItems,
                                            coins,
                                            setCoins,
                                            baseWidth = 300,
                                            autoplay = false,
                                            autoplayDelay = 3000,
                                            pauseOnHover = false,
                                            loop = false,
                                            round = false,
                                        }) {
    const containerRef = useRef(null);
    const [measuredWidth, setMeasuredWidth] = useState(0);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const ro = new ResizeObserver(() => {
            setMeasuredWidth(el.clientWidth);
        });

        ro.observe(el);
        setMeasuredWidth(el.clientWidth);

        return () => ro.disconnect();
    }, []);

    const containerPadding = 32;
    const widthForMath = measuredWidth || baseWidth;
    const itemWidth = Math.min(widthForMath - containerPadding * 2, 600);
    const trackItemOffset = itemWidth + GAP;

    const itemsForRender = useMemo(() => {
        if (!loop) return items;
        if (items.length === 0) return [];
        return [items[items.length - 1], ...items, items[0]];
    }, [items, loop]);

    const [position, setPosition] = useState(loop ? 1 : 0);
    const x = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isJumping, setIsJumping] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const itemHeight = Math.round(itemWidth * 0.7);

    useEffect(() => {
        if (pauseOnHover && containerRef.current) {
            const container = containerRef.current;
            const handleMouseEnter = () => setIsHovered(true);
            const handleMouseLeave = () => setIsHovered(false);
            container.addEventListener("mouseenter", handleMouseEnter);
            container.addEventListener("mouseleave", handleMouseLeave);
            return () => {
                container.removeEventListener("mouseenter", handleMouseEnter);
                container.removeEventListener("mouseleave", handleMouseLeave);
            };
        }
    }, [pauseOnHover]);

    useEffect(() => {
        if (!autoplay || itemsForRender.length <= 1) return;
        if (pauseOnHover && isHovered) return;

        const timer = setInterval(() => {
            setPosition((prev) => prev + 1);
        }, autoplayDelay);

        return () => clearInterval(timer);
    }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length]);

    useEffect(() => {
        const startingPosition = loop ? 1 : 0;
        setPosition(startingPosition);
        x.set(-startingPosition * trackItemOffset);
    }, [items.length, loop, trackItemOffset, x]);

    useEffect(() => {
        if (!loop && position > itemsForRender.length - 1) {
            setPosition(Math.max(0, itemsForRender.length - 1));
        }
    }, [itemsForRender.length, loop, position]);

    const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

    const handleAnimationStart = () => setIsAnimating(true);

    const handleAnimationComplete = () => {
        if (!loop || itemsForRender.length <= 1) {
            setIsAnimating(false);
            return;
        }
        const lastCloneIndex = itemsForRender.length - 1;

        if (position === lastCloneIndex) {
            setIsJumping(true);
            const target = 1;
            setPosition(target);
            x.set(-target * trackItemOffset);
            requestAnimationFrame(() => {
                setIsJumping(false);
                setIsAnimating(false);
            });
            return;
        }

        if (position === 0) {
            setIsJumping(true);
            const target = items.length;
            setPosition(target);
            x.set(-target * trackItemOffset);
            requestAnimationFrame(() => {
                setIsJumping(false);
                setIsAnimating(false);
            });
            return;
        }

        setIsAnimating(false);
    };

    const handleDragEnd = (_, info) => {
        const { offset, velocity } = info;
        const direction =
            offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
                ? 1
                : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
                    ? -1
                    : 0;

        if (direction === 0) return;

        setPosition((prev) => {
            const next = prev + direction;
            if (!loop) {
                const max = itemsForRender.length - 1;
                return Math.max(0, Math.min(next, max));
            }
            return next;
        });
    };

    const dragProps = loop
        ? {}
        : {
            dragConstraints: {
                left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
                right: 0,
            },
        };

    const activeIndex =
        items.length === 0
            ? 0
            : loop
                ? (position - 1 + items.length) % items.length
                : Math.min(position, items.length - 1);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden p-4 ${
                round ? "rounded-full border border-white" : "rounded-3xl w-full h-[550px] mx-auto pb-10"
            }`}
        >
            <motion.div
                className="flex w-full h-full"
                drag={isAnimating ? false : "x"}
                {...dragProps}
                style={{
                    gap: `${GAP}px`,
                    perspective: 1200,
                    perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
                    x,
                }}
                onDragEnd={handleDragEnd}
                animate={{ x: -(position * trackItemOffset) }}
                transition={effectiveTransition}
                onAnimationStart={handleAnimationStart}
                onAnimationComplete={handleAnimationComplete}
            >
                {itemsForRender.map((item, index) => (
                    <CarouselItem
                        key={`${item?.id ?? index}-${index}`}
                        items={items}
                        setItems={setItems}
                        coins={coins}
                        setCoins={setCoins}
                        item={item}
                        index={index}
                        itemWidth={itemWidth}
                        round={round}
                        trackItemOffset={trackItemOffset}
                        x={x}
                        transition={effectiveTransition}
                    />
                ))}
            </motion.div>

            <div className={`flex w-full justify-center ${round ? "absolute z-20 bottom-12 left-1/2 -translate-x-1/2" : ""}`}>
                <div className="mt-4 flex w-[150px] justify-between px-8">
                    {items.map((_, index) => (
                        <motion.div
                            key={index}
                            className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${
                                activeIndex === index ? (round ? "bg-white" : "bg-[#333333]") : round ? "bg-[#555]" : "bg-[rgba(51,51,51,0.4)]"
                            }`}
                            animate={{ scale: activeIndex === index ? 1.2 : 1 }}
                            onClick={() => setPosition(loop ? index + 1 : index)}
                            transition={{ duration: 0.15 }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
