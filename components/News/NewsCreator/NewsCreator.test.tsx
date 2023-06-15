import { render, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../utils/testUtils";
import NewsCreator from "./NewsCreator";
import userEvent from "@testing-library/user-event";
import News from "../../../models/News";
import mockRouter from "next-router-mock";
import ReactDOM from "react-dom";
import createPortal from "../../../__mocks__/createPortal";
import { SavedNewsResponse } from "../../../models/News";
jest.mock("next/router", () => require("next-router-mock"));
ReactDOM.createPortal = createPortal;
describe("<NewsCreator />", () => {
    test("is not creating a news if data is in incorrect type", async () => {
        renderWithProviders(<NewsCreator />, { preloadedState: { user: {} } });
        const url = screen.getAllByRole("textbox")[0];
        const title = screen.getAllByRole("textbox")[1];
        const description = screen.getAllByRole("textbox")[2];
        await userEvent.type(url, "test");
        await userEvent.type(title, "123");
        await userEvent.type(description, "123");
        const submitBtn = screen.getByRole("button");
        await userEvent.click(submitBtn);
        const warningUrl = screen.getByText("Nieprawidłowy adres URL.");
        const warningTitle = screen.getByText(
            "Tytuł musi zawierać conajmniej 8 znaków."
        );
        const warningDescription = screen.getByText(
            "Wpis musi zawierać conajmniej 8 znaków."
        );
        expect(warningTitle).toBeInTheDocument();
        expect(warningDescription).toBeInTheDocument();
        expect(warningUrl).toBeInTheDocument();
    });
    test("is showing a backend error", async () => {
        renderWithProviders(<NewsCreator />, { preloadedState: { user: {} } });
        const url = screen.getAllByRole("textbox")[0];
        const title = screen.getAllByRole("textbox")[1];
        const description = screen.getAllByRole("textbox")[2];
        await userEvent.type(url, "www.test.pl");
        await userEvent.type(title, "12345678");
        await userEvent.type(description, "12345678");
        const responseNews = {
            ok: false,
            message: "Error from backend",
            newsId: "0",
        } as SavedNewsResponse;
        News.prototype.save = async (token: string) =>
            await Promise.resolve(responseNews);
        const submitButton = screen.getByRole("button");
        await userEvent.click(submitButton);
        const errorMessage = screen.getByText("Error from backend");
        expect(errorMessage).toBeInTheDocument();
    });
    test("is creating a news if input is correct and redirects to news details", async () => {
        mockRouter.push("http://localhost:3000");
        renderWithProviders(<NewsCreator />, { preloadedState: { user: {} } });
        const url = screen.getAllByRole("textbox")[0];
        const title = screen.getAllByRole("textbox")[1];
        const description = screen.getAllByRole("textbox")[2];
        const submitButton = screen.getByRole("button");
        await userEvent.type(url, "www.test.pl");
        await userEvent.type(title, "12345678");
        await userEvent.type(description, "12345678");
        const responseNews = {
            ok: true,
            message: "ok",
            newsId: "id",
        } as SavedNewsResponse;
        News.prototype.save = async (token: string) =>
            await Promise.resolve(responseNews);
        await userEvent.click(submitButton);
        expect(mockRouter.pathname).toEqual("/news/id");
    });
});
