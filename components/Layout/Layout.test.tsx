import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import mockRouter from "next-router-mock";
import Layout from "./Layout";
import { UserData } from "../../store/user";
import { renderWithProviders } from "../../utils/testUtils";
jest.mock("next/router", () => require("next-router-mock"));

const USER = {
    userId: "123",
    username: "Test",
    token: "123",
    avatarUrl: "/",
} as UserData;

describe("<Layout />", () => {
    test("toggles menu on avatar click", async () => {
        renderWithProviders(
            <Layout>
                <></>
            </Layout>,
            { preloadedState: { user: { ...USER } } }
        );
        const img = screen.getByRole("img");
        fireEvent.click(img);

        expect(screen.getByTestId("context-menu")).toBeInTheDocument();
    });
    test("input is searching for tag", async () => {
        mockRouter.push("http://localhost/");
        renderWithProviders(
            <Layout>
                <></>
            </Layout>,
            { preloadedState: { user: { ...USER } } }
        );
        const input = screen.getByRole("textbox");
        const submitButton = screen.getByTestId("submit-search");
        await userEvent.type(input, "test");
        await userEvent.click(submitButton);
        expect(mockRouter.asPath).toContain("/tag/test");
    });
    test("logging out is working properly", async () => {
        renderWithProviders(
            <Layout>
                <></>
            </Layout>,
            { preloadedState: { user: { ...USER } } }
        );
        const img = screen.getByRole("img");
        await userEvent.click(img);
        const loggingOutBtn = screen.getByTestId("logout-btn");
        await userEvent.click(loggingOutBtn);
        expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });
    test("is not showing avatar if it is not logged in", () => {
        renderWithProviders(
            <Layout>
                <></>
            </Layout>,
            {
                preloadedState: { user: {} },
            }
        );
        const img = screen.queryByRole("img");
        expect(img).not.toBeInTheDocument();
    });
});
