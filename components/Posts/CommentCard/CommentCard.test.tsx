import { render, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../utils/testUtils";
import CommentCard from "./CommentCard";
import { comment } from "../../News/NewsCard/NewsCard.test";
import CommentDB from "../../../models/CommentDB";
import { LikeResponse } from "../../../models/PostDB";
import userEvent from "@testing-library/user-event";
import createPortal from "../../../__mocks__/createPortal";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
ReactDOM.createPortal = createPortal;
CommentDB.prototype.checkLikeStatus = async (token: string) => {
    return Promise.resolve({ ok: false, message: "not" });
};
describe("<CommentCard />", () => {
    test("is showing a error if error during like occurred", async () => {
        renderWithProviders(<CommentCard comment={comment} postId="0" />, {
            preloadedState: { user: {} },
        });
        const badLikeResponse = {
            ok: false,
            message: "Error from backend",
            likes: 0,
        } as LikeResponse;
        CommentDB.prototype.like = async () =>
            await Promise.resolve(badLikeResponse);
        const like = screen.getByTestId("like").children[0].children[0];
        await userEvent.click(like);
        const errorMessage = screen.getByText("Error from backend");
        expect(errorMessage).toBeInTheDocument();
    });
    test("is replacing likes correctly", async () => {
        renderWithProviders(<CommentCard comment={comment} postId="0" />, {
            preloadedState: { user: {} },
        });
        const likes = screen.getByText("0");
        expect(likes).toBeInTheDocument();
        const goodLikeResponse = {
            ok: true,
            message: "ok",
            likes: 1,
        } as LikeResponse;
        CommentDB.prototype.like = async () =>
            await Promise.resolve(goodLikeResponse);
        await userEvent.click(
            screen.getByTestId("like").children[0].children[0]
        );
        expect(screen.getByText("1")).toBeInTheDocument();
    });
    test("is showing image properly", async () => {
        renderWithProviders(<CommentCard postId="1" comment={comment} />, {
            preloadedState: { user: {} },
        });
        const img = screen.getAllByRole("img");
        expect(img.length).toEqual(2);
    });
    test("is not showing image if it isn't", async () => {
        comment.imageUrl = undefined;
        renderWithProviders(<CommentCard postId="1" comment={comment} />, {
            preloadedState: { user: {} },
        });
        const img = screen.getAllByRole("img");
        expect(img.length).toEqual(1);
    });
});
