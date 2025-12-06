import { defineStore } from 'pinia';

interface KeepAliveState {
    caches: string[];
}

export const useKeepAliverStore = defineStore({
    id: 'keepAliver',
    state: (): KeepAliveState => ({
        caches: []
    }),
    getters: {},
    actions: {
        add(name: string): void {
            if (!this.caches.includes(name)) {
                this.caches.push(name);
            }
        },
        remove(name: string): void {
            this.caches = this.caches.filter((item) => item !== name);
        },
        clear(): void {
            this.caches = [];
        }
    }
});
