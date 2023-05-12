import CommentDB from "./CommentDB";
import UserDB from "./UserDB";
import axios, { AxiosError } from "axios";
import ResponseApi from "../interfaces/ResponseApi";
export interface LikeResponse extends ResponseApi {
    likes: number;
}
export interface PostData extends ResponseApi {
    posts: PostDB[];
    lastPage: boolean;
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
    static async getPostsByTag(tag: string, page?: string) {
        if (!page) {
            page = "0";
        }
        try {
            const result = await axios.post("/posts/fetch-posts-by-tag", {
                tag,
                page,
            });
            return result.data as PostData;
        } catch (err) {
            if (err instanceof AxiosError) {
                return {
                    ...(err.response?.data || {
                        posts: [],
                        ok: false,
                        message: "Post not founded",
                        lastPage: true,
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
                    lastPage: false,
                } as PostData;
            }
        }
    }
    static async getPopularPosts(popularTime: Date, page?: string) {
        if (!page) {
            page = "0";
        }
        try {
            const result = await axios.post("/posts/fetch-popular-posts", {
                page,
                popularTime,
            });
            return result.data as PostData;
        } catch (err) {
            if (err instanceof AxiosError) {
                return {
                    ...(err.response?.data || {
                        posts: [],
                        ok: false,
                        message: "Post not founded",
                        lastPage: true,
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
                    lastPage: false,
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
    static async getPostById(id: string) {
        try {
            const result = await axios.post("/posts/fetch-post-by-id", {
                id,
            });
            return result.data as {
                ok: boolean;
                message: string;
                post: PostDB;
            };
        } catch (err) {
            if (err instanceof AxiosError) {
                return {
                    ok: false,
                    message: err.response?.data.message || "Not founded",
                    post: {} as PostDB,
                };
            } else {
                return {
                    ok: false,
                    message: "Unknown error.",
                    post: {} as PostDB,
                };
            }
        }
    }
    static async getPostsByUserId(id: string, page?: string) {
        if (!page) {
            page = "0";
        }
        try {
            const result = await axios.post("/posts/fetch-posts-by-user-id", {
                id,
                page,
            });
            return result.data as {
                ok: boolean;
                message: string;
                posts: PostDB[];
                lastPage: boolean;
            };
        } catch (err) {
            if (err instanceof AxiosError) {
                return {
                    ok: false,
                    message: err.response?.data.message || "Not founded",
                    posts: [] as PostDB[],
                    lastPage: true,
                };
            } else {
                return {
                    ok: false,
                    message: "Unknown error.",
                    posts: [] as PostDB[],
                    lastPage: true,
                };
            }
        }
    }
    static async getPostsLikedByUserId(id: string, page?: string) {
        try {
            const result = await axios.post(
                "/posts/fetch-liked-posts-by-user-id",
                {
                    id,
                    page: page,
                }
            );
            return result.data as {
                ok: boolean;
                message: string;
                posts: PostDB[];
                lastPage: boolean;
            };
        } catch (err) {
            if (err instanceof AxiosError) {
                return {
                    ok: false,
                    message: err.response?.data.message || "Not founded",
                    posts: [] as PostDB[],
                    lastPage: true,
                };
            } else {
                return {
                    ok: false,
                    message: "Unknown error.",
                    posts: [] as PostDB[],
                    lastPage: true,
                };
            }
        }
    }
}
export default PostDB;
