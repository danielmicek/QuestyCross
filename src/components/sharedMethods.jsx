import {toast} from "react-hot-toast";


export function toasterFunction(message, type) {
    if(type === "error") return toast.error(message, {
        style: {
            border: '2px solid black',
            padding: '16px',
            color: 'black',
            background: '#f7534a',
            fontWeight: "bold"
        },
        iconTheme: {
            primary: 'black',
            secondary: '#FFFAEE',
        },
    });
    else return toast.success(message , {
        style: {
            border: '2px solid black',
            padding: '16px',
            color: 'black',
            background: '#25b827',
            fontWeight: "bold"
        },
        iconTheme: {
            primary: 'black',
            secondary: '#FFFAEE',
        },
    });
}