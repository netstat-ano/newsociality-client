import axios, { AxiosError } from "axios";
import ResponseApi from "../interfaces/ResponseApi";

class Post {
    declare userId: string;
    declare postText: string;
    declare image?: Blob | string;
    declare tags: string[];
    constructor(
        userId: string,
        postText: string,
        image: Blob | undefined,
        tags: string[]
    ) {
        this.userId = userId;
        this.postText = postText;
        this.image = image;
        this.tags = tags;
    }
    async save(token: string) {
        const body = new FormData();
        body.append("userId", this.userId);
        body.append("postText", this.postText);
        body.append("tags", JSON.stringify(this.tags));
        if (this.image) {
            body.append("image", this.image);
        }
        try {
            const result = await axios.post("/posts/create-post", body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            return result.data as ResponseApi;
        } catch (err) {
            return {
                ok: false,
                message: "Unknown error",
            } as ResponseApi;
        }
    }
}
export default Post;
