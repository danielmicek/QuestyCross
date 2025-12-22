import React from 'react';
import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';



export default function DraggableAbility({ability}) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({id: ability.id,});
    const style = {
        transform: CSS.Translate.toString(transform),
        touchAction: "none",
        userSelect: "none"
    };

    return (
        <div className="w-full h-full relative flex items-center " key = {ability.id} >
            <p className="text-white font-bold absolute left-0 z-999">{ability.owned} x</p>
            <img
                ref = {setNodeRef}
                src={ability.image}
                className="w-[60px] h-[60px] object-cover absolute left-8 cursor-grab active:cursor-grabbing hover:scale-105 transition-all"
                alt={ability.name}
                {...listeners}
                {...attributes}
                style={style}
            />
        </div>
    );
}
