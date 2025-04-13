'use client'

import { useEffect, useState } from "react";

function Loading() {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])

    if (!loading) {
        return <></>
    }

    return (
        <div className="fixed w-full h-full z-100 backdrop-blur-xs flex justify-center items-center">

            <div className="flex justify-center items-center">
                <div className="loader"></div>
            </div>

        </div>
    );
}

export default Loading;