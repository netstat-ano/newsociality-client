import UserDB from "./UserDB";
import CommentDB from "./CommentDB";
import axios, { AxiosError } from "axios";
interface FetchingNewsResponse {
    news: NewsDB[];
    ok: boolean;
    message: string;
    lastPage: boolean;
}
class NewsDB {
    declare userId: UserDB;
    declare _id: string;
    declare createdAt: string;
    declare updatedAt: string;
    declare newsUrl: string;
    declare newsDescription: string;
    declare tags: string[] | never[];
    declare likes?: number;
    declare comments?: CommentDB[];
    constructor(
        userId: UserDB,
        _id: string,
        createdAt: string,
        updatedAt: string,
        newsUrl: string,
        newsDecription: string,
        tags: string[] | never[],
        likes?: number,
        comments?: CommentDB[]
    ) {
        this.userId = userId;
        this.newsUrl = newsUrl;
        this._id = _id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.newsDescription = newsDecription;
        this.tags = tags;
        this.likes = likes;
        this.comments = comments;
    }
    static async getPopularNews(popularTime: Date, page?: string) {
        if (!page) {
            page = "0";
        }
        try {
            const result = await axios.post("/news/fetch-popular-news", {
                page,
                popularTime,
            });
            return result.data as FetchingNewsResponse;
        } catch (err) {
            if (err instanceof AxiosError) {
                return {
                    ...((err.response?.data || {
                        news: [],
                        ok: false,
                        message: "News not founded",
                        lastPage: true,
                    }) as FetchingNewsResponse),
                };
            } else {
                return {
                    ok: false,
                    message: "Unknown error",
                    news: [
                        {
                            _id: "",
                            userId: {
                                _id: "",
                                username: "",
                            },
                            newsDescription: "",
                            newsUrl: "",
                            tags: [],
                        },
                    ],
                    lastPage: false,
                } as FetchingNewsResponse;
            }
        }
    }
}
export default NewsDB;
