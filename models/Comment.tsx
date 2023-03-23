import axios, { AxiosError } from "axios";
import ResponseApi from "../interfaces/ResponseApi";
class Comment {
    declare userId: string;
    declare commentText: string;
    declare postId: string;
    constructor(userId: string, commentText: string, postId: string) {
        this.userId = userId;
        this.commentText = commentText;
        this.postId = postId;
    }
    async save(token: string) {
        try {
            const result = await axios.post("/posts/create-comment", this, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return result.data as ResponseApi;
        } catch (err) {
            if (err instanceof AxiosError) {
                return {
                    ok: false,
                    message: err.response!.data.message,
                } as ResponseApi;
            } else {
                return {
                    ok: false,
                    message: "Unknown error.",
                };
            }
        }
    }
}
export default Comment;
