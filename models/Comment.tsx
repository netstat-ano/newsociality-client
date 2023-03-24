import axios, { AxiosError } from "axios";
import ResponseApi from "../interfaces/ResponseApi";
interface FreshComment extends ResponseApi {
    addedComment?: {
        userId: string;
        commentText: string;
        _id: string;
        createdAt: string;
        updatedAt: string;
        imageUrl?: string;
    };
}
class Comment {
    declare userId: string;
    declare commentText: string;
    declare postId: string;
    declare image?: Blob | string;
    constructor(
        userId: string,
        commentText: string,
        postId: string,
        image?: Blob
    ) {
        this.userId = userId;
        this.commentText = commentText;
        this.postId = postId;
        this.image = image;
    }
    async save(token: string) {
        const body = new FormData();
        body.append("userId", this.userId);
        body.append("commentText", this.commentText);
        body.append("postId", this.postId);
        if (this.image) {
            body.append("image", this.image);
        }
        try {
            const result = await axios.post("/posts/create-comment", body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            return result.data as FreshComment;
        } catch (err) {
            if (err instanceof AxiosError) {
                return {
                    ok: false,
                    message: err.response!.data.message,
                } as FreshComment;
            } else {
                return {
                    ok: false,
                    message: "Unknown error.",
                } as FreshComment;
            }
        }
    }
}
export default Comment;
