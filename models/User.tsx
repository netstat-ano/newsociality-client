import axios, { AxiosError } from "axios";
interface UserData {
    userId?: string;
    token?: string;
    avatarUrl?: string;
    username?: string;
}
interface UserDataResponse extends UserData {
    ok: boolean;
    message: string;
}
class User {
    declare email: string;
    declare username: string | null;
    declare password: string;
    constructor(email: string, username: string | null, password: string) {
        this.email = email;
        this.username = username;
        this.password = password;
    }
    async save() {
        try {
            const result = await axios.post("/auth/create-user", {
                ...this,
            });
            return result.data as UserDataResponse;
        } catch (err) {
            return {
                ok: false,
                message: "Unknown error",
                userId: undefined,
                token: undefined,
                username: undefined,
            } as UserDataResponse;
        }
    }

    async login(expire?: number) {
        try {
            const result = await axios.post("/auth/login-user", {
                email: this.email,
                password: this.password,
                expire: expire,
            });
            return result.data as UserDataResponse;
        } catch (err) {
            return {
                ok: false,
                message: "Unknown error",
                userId: undefined,
                token: undefined,
                avatarUrl: undefined,
                username: undefined,
            } as UserDataResponse;
        }
    }
    static saveToLocalstorage(
        userId: string,
        token: string,
        avatarUrl: string,
        hours: number,
        username: string
    ) {
        localStorage.setItem("username", `${username}`);
        localStorage.setItem("userId", `${userId}`);
        localStorage.setItem("token", `${token}`);
        localStorage.setItem(
            "expire",
            `${new Date().getTime() + hours * 60 * 60 * 1000}`
        );
        localStorage.setItem("avatarUrl", `${avatarUrl}`);
    }
    static getFromLocalstorage() {
        const expirationTime = new Date(
            String(localStorage.getItem("expire"))
        ).getTime();
        if (expirationTime > new Date().getTime()) {
            User.clearLocalstorage();
            return {
                userId: undefined,
                token: undefined,
                avatarUrl: undefined,
            } as UserData;
        }
        return {
            userId: localStorage.getItem("userId"),
            token: localStorage.getItem("token"),
            avatarUrl: localStorage.getItem("avatarUrl"),
            username: localStorage.getItem("username"),
        } as UserData;
    }
    static clearLocalstorage() {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("expire");
        localStorage.removeItem("avatarUrl");
    }
}
export default User;
