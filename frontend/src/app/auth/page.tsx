'use client'

import Login from "@/components/pages/auth/Login";
import Register from "@/components/pages/auth/Register";
import View from "@/components/View";
import { useState } from "react";

export default function Authorization() {

    const [type, setType] = useState<"LOGIN" | "REGISTER">('LOGIN');

    return (
        <View className="flex grow items-center justify-center">

            {type == "LOGIN" && (<Login setType={setType}></Login>)}
            {type == "REGISTER" && (<Register setType={setType}></Register>)}

        </View>
    );
}
