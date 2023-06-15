import { render, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../utils/testUtils";
import CommentCreator from "./CommentCreator";
import userEvent from "@testing-library/user-event";
import Comment from "../../../models/Comment";
import ReactDOM from "react-dom";
import createPortalMock from "../../../__mocks__/createPortal";
ReactDOM.createPortal = createPortalMock;
const setComments = jest.fn();
describe("<CommentCreator />", () => {
    test("is showing properly warning if user write too short comment", async () => {
        renderWithProviders(
            <CommentCreator postId="1" setComments={setComments} />,
            { preloadedState: { user: {} } }
        );
        const input = screen.getByRole("textbox");
        await userEvent.type(input, "123");
        const submitBtn = screen.getByRole("button");
        await userEvent.click(submitBtn);
        const warning = screen.getByText(
            "Komentarz musi zawierać conajmniej 4 znaki."
        );
        expect(warning).toBeInTheDocument();
    });
    test("is showing warning from server if client side validation is off", async () => {
        Comment.prototype.save = async (token: string) => {
            return Promise.resolve({
                ok: false,
                message: "error from backend",
            });
        };
        renderWithProviders(
            <CommentCreator postId="1" setComments={setComments} />,
            { preloadedState: { user: {} } }
        );
        const input = screen.getByRole("textbox");
        await userEvent.type(input, "12345678");
        const submitBtn = screen.getByRole("button");
        await userEvent.click(submitBtn);
        const warning = screen.getByText("error from backend");
        expect(warning).toBeInTheDocument();
    });
    test("is showing filename when image is uploaded", async () => {
        const file = new File(["test"], "test.png", { type: "image/png" });
        renderWithProviders(
            <CommentCreator postId="1" setComments={setComments} />,
            { preloadedState: { user: {} } }
        );
        const fileInput = screen.getByTestId("input-img");
        await userEvent.upload(fileInput, file);
        expect(screen.getByText("test.png")).toBeInTheDocument();
    });
    test("is reseting filename when uploaded image is canceled", async () => {
        const file = new File(["test"], "test.png", { type: "image/png" });
        renderWithProviders(
            <CommentCreator postId="1" setComments={setComments} />,
            { preloadedState: { user: {} } }
        );
        const fileInput = screen.getByTestId("input-img");
        await userEvent.upload(fileInput, file);
        const resetIcon =
            screen.getByTestId("reset-wrapper").children[0].children[0];
        await userEvent.click(resetIcon);
        expect(screen.queryByText("test.png")).not.toBeInTheDocument();
    });
});
