import { render, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../../utils/testUtils";
import CommentsSection from "./CommentsSection";
import PostDB from "../../../models/PostDB";
import ReactDOM from "react-dom";
import createPortal from "../../../__mocks__/createPortal";
ReactDOM.createPortal = createPortal;
PostDB.getCommentsByPostId = (id: string) => {
    return Promise.resolve({
        ok: false,
        message: "error on backend",
        comments: [],
    });
};
describe("<CommentsSection />", () => {
    test("is showing warning if error on server occured", async () => {
        renderWithProviders(<CommentsSection postId="1" />, {
            preloadedState: { user: {} },
        });

        await waitFor(() => {
            const warning = screen.getByText("error on backend");
            expect(warning).toBeInTheDocument();
        });
    });
});
