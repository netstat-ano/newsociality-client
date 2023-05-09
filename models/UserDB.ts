import axios from "axios";
import { LikeResponse } from "./PostDB";
import { AxiosError } from "axios";
import ResponseApi from "../interfaces/ResponseApi";
interface ChangeAvatarResponse extends ResponseApi {
    path: string;
}
class UserDB {
    declare _id: string;
    declare username: string;
    declare avatarUrl: string;

    constructor(_id: string, username: string, avatarUrl: string) {
        this._id = _id;
        this.username = username;
        this.avatarUrl = avatarUrl;
    }
    async changeAvatar(token: string, newAvatar: Blob) {
        const formData = new FormData();
        formData.append("id", this._id);
        formData.append("newAvatar", newAvatar);

        try {
            const result = await axios.post("/auth/change-avatar", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            return result.data as ChangeAvatarResponse;
        } catch (err) {
            if (err instanceof AxiosError) {
                return {
                    ok: false,
                    message: "",
                    path: "",
                } as ChangeAvatarResponse;
            } else {
                return {
                    ok: false,
                    message: "Unknown error.",
                    path: "",
                } as ChangeAvatarResponse;
            }
        }
    }
}
export default UserDB;
