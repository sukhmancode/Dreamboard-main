import { ReactNode } from "react";

export function IconButton({icon,onClick,activated} : {
    icon:ReactNode,
    onClick:() => void
    ,activated:boolean
}) {
    return (
        <button onClick={onClick} className={`cursor-pointer rounded-full border p-2 bg-black hover:bg-gray-800 text-white transition-all ${
            activated ? "text-red-400 ring-2 ring-red-400" : "text-white"
          }`}
          >
            {icon}
        </button>
    )
}