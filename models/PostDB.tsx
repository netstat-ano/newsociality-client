import CommentDB from "./CommentDB";
import UserDB from "./UserDB";
import axios, { AxiosError } from "axios";
import ResponseApi from "../interfaces/ResponseApi";
export interface LikeResponse extends ResponseApi {
    likes: number;
}
export interface PostData extends ResponseApi {
    posts: PostDB[];
}
export interface LikeResponse extends ResponseApi {
    likes: number;
}
class PostDB {
    declare userId: UserDB;
    declare _id: string;
    declare createdAt: string;
    declare updatedAt: string;
    declare postText: string;
    declare imgUrl?: string;
    declare tags: string[] | never[];
    declare likes?: number;
    declare comments?: CommentDB[];

    constructor(
        userId: UserDB,
        _id: string,
        createdAt: string,
        updatedAt: string,
        postText: string,
        tags: string[] | never[],
        imgUrl?: string,
        likes?: number,
        comments?: CommentDB[]
    ) {
        this.userId = userId;
        this._id = _id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.postText = postText;
        this.imgUrl = imgUrl;
        this.tags = tags;
        this.likes = likes;
        this.comments = comments;
    }
    async like(token: string) {
        try {
            const result = await axios.post(
                "/posts/like-post",
                { id: this._id },
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
    static async getPostsByTag(tag: string) {
        try {
            const result = await axios.post("/posts/fetch-posts-by-tag", {
                tag,
            });
            return result.data as PostData;
        } catch (err) {
            if (err instanceof AxiosError) {
                return {
                    ...(err.response?.data || {
                        posts: [],
                        ok: false,
                        message: "Post not founded",
                    }),
                } as PostData;
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
                } as PostData;
            }
        }
    }
    async checkLikeStatus(token: string) {
        try {
            const result = await axios.post(
                "/posts/check-like-status-by-id",
                {
                    id: this._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return result.data as ResponseApi;
        } catch (err) {
            if (err instanceof AxiosError) {
                return {
                    ok: false,
                    message: err.response?.data.message || "Not founded",
                };
            } else {
                return {
                    ok: false,
                    message: "Unknown error.",
                } as ResponseApi;
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
                comments: CommentDB[];
            };
        } catch (err) {
            if (err instanceof AxiosError) {
                return {
                    ok: false,
                    message: err.response?.data.message || "Not founded",
                    comments: [],
                };
            } else {
                return {
                    ok: false,
                    message: "Unknown error.",
                    comments: [] as CommentDB[],
                };
            }
        }
    }
}
export default PostDB;
