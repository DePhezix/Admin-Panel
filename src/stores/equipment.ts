import { defineStore } from "pinia";
import axios from 'axios'

export const useEquipmentStore = defineStore("equipment", () => {
    async function PostEquipmentHealth(status: "ok" | "warning" | "critical", temperature: number, pressure: number) {
        axios.post()
    }
})