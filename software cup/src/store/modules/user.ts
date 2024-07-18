import { defineStore } from 'pinia'

interface User {
    email: string;
}

interface UserState {
    user: User | null;
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        user: null,
    }),
    persist: true,
    actions: {
        setUser(user: User) {
            this.user = user;
        },
        clearUser() {
            this.user = null;
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.user,
    },
},)
