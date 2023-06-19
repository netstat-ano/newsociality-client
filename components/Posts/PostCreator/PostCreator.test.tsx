import { renderWithProviders } from "../../../utils/testUtils";
import PostCreator from "./PostCreator";
import mockRouter from "next-router-mock";
import Post from "../../../models/Post";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReactDOM from "react-dom";
import createPortalMock from "../../../__mocks__/createPortal";
jest.mock("next/router", () => require("next-router-mock"));
ReactDOM.createPortal = createPortalMock;
describe("<PostCreator />", () => {
    test("is showing server error", async () => {
        mockRouter.push("http://localhost:3000");
        Post.prototype.save = async () => {
            return Promise.resolve({
                ok: false,
                message: "error on server",
                postId: "",
            });
        };
        renderWithProviders(<PostCreator />, { preloadedState: { user: {} } });
        const input = screen.getByRole("textbox");
        await userEvent.type(input, "123456789");
        const submitButton = screen.getByRole("button");
        await userEvent.click(submitButton);

        const warning = screen.getByText("error on server");
        expect(warning).toBeInTheDocument();
    });
    test("is validation on client side works correctly", async () => {
        renderWithProviders(<PostCreator />, { preloadedState: { user: {} } });
        const input = screen.getByRole("textbox");
        await userEvent.type(input, "1234567");
        const submitButton = screen.getByRole("button");
        await userEvent.click(submitButton);
        const warning = screen.getByText(
            "Wpis musi zawierać conajmniej 8 znaków."
        );
        expect(warning).toBeInTheDocument();
    });
    test("is submiting form when data is correct", async () => {
        Post.prototype.save = jest.fn();
        renderWithProviders(<PostCreator />, { preloadedState: { user: {} } });
        const input = screen.getByRole("textbox");
        await userEvent.type(input, "123456789");
        const submitButton = screen.getByRole("button");
        await userEvent.click(submitButton);
        expect(Post.prototype.save).toBeCalled();
    });
    test("is redirecting after submitting valid form", async () => {
        mockRouter.push("http://localhost:3000");
        Post.prototype.save = async (token: string) =>
            Promise.resolve({
                ok: true,
                message: "ok",
                postId: "1",
            });
        renderWithProviders(<PostCreator />, { preloadedState: { user: {} } });
        const input = screen.getByRole("textbox");
        await userEvent.type(input, "123456789");
        const submitButton = screen.getByRole("button");
        await userEvent.click(submitButton);
        expect(mockRouter.asPath).toEqual("/post/1");
    });
    test("is showing filename when image is uploaded", async () => {
        const file = new File(["test"], "test.png", { type: "image/png" });
        renderWithProviders(<PostCreator />, { preloadedState: { user: {} } });
        const fileInput = screen.getByTestId("input-img");
        await userEvent.upload(fileInput, file);
        expect(screen.getByText("test.png")).toBeInTheDocument();
    });
});
