import axios, { AxiosError } from "axios";
class News {
    declare userId: string;
    declare newsDescription: string;
    declare newsUrl: string;
    declare tags: string[];
    constructor(
        userId: string,
        newsDescription: string,
        newsUrl: string,
        tags: string[]
    ) {
        this.userId = userId;
        this.newsDescription = newsDescription;
        this.newsUrl = newsUrl;
        this.tags = tags;
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
            return result.data;
        } catch (err: any) {
            if (err instanceof AxiosError) {
                return {
                    ok: false,
                    message: err.response?.data.message,
                };
            }
            return {
                ok: false,
                message: err.message,
                userId: undefined,
                token: undefined,
                username: undefined,
            };
        }
    }
}

export default News;
