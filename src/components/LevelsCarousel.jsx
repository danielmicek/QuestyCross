import React, {useState, useEffect, useCallback, useRef} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Thumb } from './LevelsCarouselThumbsButton.jsx'

export default function LevelsCarousel({slides, options, isLevelsVisible, setIsLevelsVisible}) {
    const carouselRef = useRef(null)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options)
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: 'keepSnaps',
        dragFree: true
    })

    const onThumbClick = useCallback(
        (index) => {
            if (!emblaMainApi || !emblaThumbsApi) return
            emblaMainApi.scrollTo(index)
        },
        [emblaMainApi, emblaThumbsApi]
    )

    const onSelect = useCallback(() => {
        if (!emblaMainApi || !emblaThumbsApi) return
        setSelectedIndex(emblaMainApi.selectedScrollSnap())
        emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
    }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (carouselRef.current && !carouselRef.current.contains(e.target)) {
                setIsLevelsVisible(false);
            }
        };

        if (isLevelsVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isLevelsVisible,setIsLevelsVisible]);

    useEffect(() => {
        if (!emblaMainApi) return
        onSelect()

        emblaMainApi.on('select', onSelect).on('reInit', onSelect)
    }, [emblaMainApi, onSelect])

    return (
        <div className="fixed inset-0 backdrop-blur-md bg-black/30 pointer-events-auto z-1003">
            <div className="embla z-1004 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl px-4" ref={carouselRef}>
                <div className="embla__viewport" ref={emblaMainRef}>
                    <div className="embla__container">
                        {slides.map((index) => (
                            <div className="embla__slide" key={index}>
                                <div className="embla__slide__number">{index + 1}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="embla-thumbs">
                    <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
                        <div className="embla-thumbs__container">
                            {slides.map((index) => (
                                <Thumb
                                    key={index}
                                    onClick={() => onThumbClick(index)}
                                    selected={index === selectedIndex}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

