import { DataSet } from "@/types";
import { create } from "zustand";

type DatasetType = {
    datasets: DataSet[];
    setDatasets: (datasets: DataSet[]) => void;

};

export const useDataset = create<DatasetType>((set) => ({
    datasets: [],
    setDatasets: (datasets) => set({
        datasets
    }),
}));