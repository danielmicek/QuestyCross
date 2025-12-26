import {calculateNoAccessArea, getNumOfColumns} from "./functions.jsx";

export const NUM_OF_COLUMNS = getNumOfColumns()
export const SQUARE_SIZE = Math.floor(window.innerWidth / NUM_OF_COLUMNS)
export const ACTIVE_AREA = 5    // (pocet stlpcov) aktivna oblast mapy -> po ktorej sa postavicka moze pohybovat
export const NO_ACCESS_AREA = calculateNoAccessArea(NUM_OF_COLUMNS, ACTIVE_AREA);