import { User } from "@/types";
import { create } from "zustand";

type UserType = {
    student: User | null;

    setStudent: (user: Student | null) => void;

};

export const useAuth = create<UserType>((set) => ({
    student: null,

    setStudent: (student) => set({
        student: student
    }),
}));