import axios, { AxiosError } from "axios";
import ResponseApi from "../interfaces/ResponseApi";
export interface CommentResponse {
    userId: {
        _id: string;
        username: string;
        avatarUrl: string;
    };
    commentText: string;
    createdAt?: string;
    updatedAt?: string;
    _id?: string;
    imageUrl?: string;
}
export interface PostData {
    userId: {
        _id?: string;
        username?: string;
        avatarUrl?: string;
    };
    _id: string;
    createdAt?: string;
    updatedAt?: string;
    postText: string;
    imgUrl?: string;
    tags: string[];
    likes?: number;
    comments?: CommentResponse[];
}
export interface PostResponse {
    ok: boolean;
    message: string;
    posts: PostData[];
}
export interface LikeResponse extends ResponseApi {
    likes: number;
}
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
    static async getPostsByTag(tag: string) {
        try {
            const result = await axios.post("/posts/fetch-posts-by-tag", {
                tag,
            });
            return result.data as PostResponse;
        } catch (err) {
            if (err instanceof AxiosError) {
                return {
                    ...err.response!.data,
                } as PostResponse;
            } else {
                return {
                    ok: false,
                    message: "Unknown error",
                    posts: [
                        {
                            _id: "",
                            userId: {
                                _id: "",
                                username: "",
                            },
                            postText: "",
                            imgUrl: "",
                            tags: [],
                        },
                    ],
                } as PostResponse;
            }
        }
    }

    static async getCommentsByPostId(id: string) {
        try {
            const result = await axios.post(
                "/posts/fetch-comments-by-post-id",
                {
                    id,
                }
            );
            return result.data as {
                ok: boolean;
                message: string;
                comments: CommentResponse[];
            };
        } catch (err) {
            if (err instanceof AxiosError) {
                return {
                    ok: false,
                    message: err.response!.data.message,
                    comments: [],
                };
            } else {
                return {
                    ok: false,
                    message: "Unknown error.",
                    comments: [] as CommentResponse[],
                };
            }
        }
    }
    static async like(id: string, token: string) {
        try {
            const result = await axios.post(
                "/posts/like-post",
                { id },
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
}
export default Post;
