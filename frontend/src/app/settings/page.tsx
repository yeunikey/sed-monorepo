"use client"

import SettingsAccount from "@/components/pages/settings/SettingsAccount";
import SettingsCategories from "@/components/pages/settings/SettingsCategories";
import SettingsImage from "@/components/pages/settings/SettingsImage";
import SettingsSecurity from "@/components/pages/settings/SettingsSecurity";
import View from "@/components/View";
import { useState } from "react";

export default function Page() {

    const contents = [
        <SettingsAccount key={1} />,
        <SettingsSecurity key={2} />,
        <SettingsImage key={3} />
    ]

    const [selected, setSelected] = useState(0);

    return (
        <View className="mt-12 grow flex flex-col" container>

            <div className="flex flex-row gap-2">
                <div className="text-dark-light-gray">
                    SED
                </div>
                <div className="text-dark font-bold">
                    /
                </div>
                <div className="text-dark-light-gray">
                    Настройки
                </div>
            </div>

            <SettingsCategories selected={selected} setSelected={setSelected} />

            <div className="mt-6 grow flex flex-col">
                {contents[selected]}
            </div>

        </View>
    );
}