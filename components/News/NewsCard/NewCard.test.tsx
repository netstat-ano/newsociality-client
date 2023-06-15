import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import mockRouter from "next-router-mock";
import axios, { AxiosResponse } from "axios";
import NewsCard from "./NewsCard";
import configureStore from "redux-mock-store";
import { UserData } from "../../../store/user";
import { renderWithProviders } from "../../../utils/testUtils";
import PostDB from "../../../models/PostDB";
import UserDB from "../../../models/UserDB";
import CommentDB from "../../../models/CommentDB";
jest.mock("next/router", () => require("next-router-mock"));
jest.mock("axios");
export const user = new UserDB("123", "test", "/avatarurl");

const news = new PostDB(
    user,
    "123id",
    new Date().toDateString(),
    new Date().toDateString(),
    ["123"],
    undefined,
    undefined,
    123,
    [],
    "newsDescription",
    "/newsUrl",
    "newsTitle"
);
export const comment = new CommentDB(
    user,
    "testComment",
    new Date().toDateString(),
    new Date().toDateString(),
    "1234",
    "/url",
    0
);
describe("<NewCard />", () => {
    test("is showing info properly", () => {
        renderWithProviders(<NewsCard news={news} />, {
            preloadedState: { user: {} },
        });
        const tag = screen.queryByText("123");
        const description = screen.queryByText("newsDescription");
        const url = screen.queryByText("/newsUrl");
        const newsTitle = screen.queryByText("newsTitle");
        expect(newsTitle).toBeInTheDocument();
        expect(url).toBeInTheDocument();
        expect(description).toBeInTheDocument();
        expect(tag).toBeInTheDocument();
    });
    test("is showing comments on default comment showed", async () => {
        PostDB.getCommentsByPostId = async (id: string) =>
            await Promise.resolve({
                comments: [comment],
                ok: true,
                message: "ok",
            });
        renderWithProviders(
            <NewsCard news={news} commentsDefaultShowed={true} />,
            {
                preloadedState: { user: {} },
            }
        );
        const comments = screen.queryByTestId("comments-section");
        await waitFor(() => {
            const commentCard = screen.queryByTestId("comment-card");
            expect(commentCard).toBeInTheDocument();
        });
        expect(comments).toBeInTheDocument();
    });
    test("is showing comments on click", async () => {
        PostDB.getCommentsByPostId = async (id: string) =>
            await Promise.resolve({
                comments: [comment],
                ok: true,
                message: "ok",
            });
        renderWithProviders(<NewsCard news={news} />, {
            preloadedState: { user: {} },
        });
        const svg = screen.getByTestId("comments-wrapper").children[0];
        await userEvent.click(svg);
        const comments = screen.queryByTestId("comments-section");
        await waitFor(() => {
            const commentCard = screen.queryByTestId("comment-card");
            expect(commentCard).toBeInTheDocument();
        });
        expect(comments).toBeInTheDocument();
    });
    test("is showing comments creator when user is logged in", async () => {
        renderWithProviders(<NewsCard news={news} />, {
            preloadedState: {
                user: {
                    userId: "123",
                    username: "test",
                    avatarUrl: "/123.jpg",
                    token: "123",
                },
            },
        });
        const svg = screen.getByTestId("comments-wrapper").children[0];
        await userEvent.click(svg);
        const commentsCreator = screen.getByTestId("comment-creator");
        expect(commentsCreator).toBeInTheDocument();
    });
    test("isn't showing comments creator when user is not logged in", async () => {
        renderWithProviders(<NewsCard news={news} />, {
            preloadedState: {
                user: {},
            },
        });
        const svg = screen.getByTestId("comments-wrapper").children[0];
        await userEvent.click(svg);
        const commentsCreator = screen.queryByTestId("comment-creator");
        expect(commentsCreator).not.toBeInTheDocument();
    });
});
