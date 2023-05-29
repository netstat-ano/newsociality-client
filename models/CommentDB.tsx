import UserDB from "./UserDB";
import { LikeResponse } from "./PostDB";
import { AxiosError } from "axios";
import axios from "axios";
import ResponseApi from "../interfaces/ResponseApi";
class CommentDB {
    declare userId: UserDB;
    declare commentText: string;
    declare createdAt: string;
    declare updatedAt: string;
    declare _id: string;
    declare imageUrl?: string;
    declare likes?: number;

    constructor(
        userId: UserDB,
        commentText: string,
        createdAt: string,
        updatedAt: string,
        _id: string,
        imageUrl?: string,
        likes?: number
    ) {
        this.userId = userId;
        this.commentText = commentText;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this._id = _id;
        this.imageUrl = imageUrl;
        this.likes = likes;
    }
    async like(token: string, postId: string) {
        try {
            const result = await axios.post(
                "/comment/like-comment",
                { id: this._id, postId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return result.data as LikeResponse;
        } catch (err) {
            if (err instanceof AxiosError) {
                return {
                    ok: false,
                    message: err.response!.data.message,
                } as LikeResponse;
            } else {
                return {
                    ok: false,
                    message: "Unknown error.",
                    likes: 0,
                } as LikeResponse;
            }
        }
    }
    async checkLikeStatus(token: string) {
        try {
            const result = await axios.post(
                "/comment/check-like-status",
                { id: this._id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return result.data as ResponseApi;
        } catch (err: any) {
            if (err instanceof AxiosError) {
                return {
                    ok: false,
                    message: err.response!.data.message,
                } as ResponseApi;
            } else {
                return {
                    ok: false,
                    message: err.message,
                } as ResponseApi;
            }
        }
    }
}

export default CommentDB;
