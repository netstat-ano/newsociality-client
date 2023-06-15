import PostDB from "../../../models/PostDB";
import { renderWithProviders } from "../../../utils/testUtils";
import PostCard from "./PostCard";
import { screen } from "@testing-library/react";
import { user } from "../../News/NewsCard/NewCard.test";
import userEvent from "@testing-library/user-event";
PostDB.prototype.checkLikeStatus = async (token: string) => {
    return Promise.resolve({ ok: true, message: "DISLIKED" });
};
export const post = new PostDB(
    user,
    "123id",
    new Date().toDateString(),
    new Date().toDateString(),
    ["123"],
    "postText",
    "/postUrl",
    11,
    []
);
describe("<PostCard />", () => {
    test("is replacing likes working correctly", async () => {
        PostDB.prototype.like = async (token: string) => {
            return Promise.resolve({ ok: true, message: "liked", likes: 12 });
        };
        renderWithProviders(<PostCard post={post} />, {
            preloadedState: { user: {} },
        });
        const likeBtn = screen.getByTestId("like").children[0].children[0];
        await userEvent.click(likeBtn);
        const likes = screen.getByText("12");
        expect(likes).toBeInTheDocument();
    });
    test("is showing comments work correctly", async () => {
        renderWithProviders(<PostCard post={post} />, {
            preloadedState: { user: {} },
        });
        const toggleComments =
            screen.getByTestId("toggle-comments").children[0].children[0];
        await userEvent.click(toggleComments);
        const commentsWrapper = screen.getByTestId("comments-section");
        expect(commentsWrapper).toBeInTheDocument();
    });
});
