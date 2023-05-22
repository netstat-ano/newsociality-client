import axios, { AxiosError } from "axios";
interface SavedNewsResponse {
    ok: boolean;
    message: string;
    newsId: string;
}
class News {
    declare userId: string;
    declare newsDescription: string;
    declare newsUrl: string;
    declare tags: string[];
    declare newsTitle: string;
    constructor(
        userId: string,
        newsDescription: string,
        newsUrl: string,
        tags: string[],
        newsTitle: string
    ) {
        this.userId = userId;
        this.newsDescription = newsDescription;
        this.newsUrl = newsUrl;
        this.tags = tags;
        this.newsTitle = newsTitle;
    }
    async save(token: string) {
        try {
            const result = await axios.post(
                "/news/create-news",
                {
                    ...this,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return result.data as SavedNewsResponse;
        } catch (err: any) {
            if (err instanceof AxiosError) {
                return {
                    ok: false,
                    message: err.response?.data.message,
                    newsId: "",
                } as SavedNewsResponse;
            }
            return {
                ok: false,
                message: err.message,
                newsId: "",
            } as SavedNewsResponse;
        }
    }
}

export default News;
