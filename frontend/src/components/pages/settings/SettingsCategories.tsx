import { MouseEventHandler } from "react";

interface CategoriesProps {
    selected: number,
    setSelected: (number: number) => void
}

function SettingsCategories({ selected, setSelected }: CategoriesProps) {

    const categories = [
        {
            name: "Аккаунт"
        },
        {
            name: "Безопасность"
        },
        {
            name: "Аватар"
        }
    ]

    return (
        <div className="mt-6 flex gap-3">

            {categories.map((category, i) => {
                return (
                    <CategoryItem
                        key={i}
                        text={category.name}
                        active={i == selected}
                        onClick={() => {
                            setSelected(i)
                        }}
                    ></CategoryItem>
                )
            })}

        </div>
    );
}

function CategoryItem({ text, active, onClick }: { text: string, active: boolean, onClick: MouseEventHandler<HTMLDivElement> }) {
    return (
        <div className={`py-2 px-6 rounded-2xl cursor-pointer ${active ? "bg-dark text-white" : "bg-muted"}`}
            onClick={onClick}
        >
            {text}
        </div>
    )
}

export default SettingsCategories;