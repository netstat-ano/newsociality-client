import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import TrendingSwitch from "./TrendingSwitch";
jest.mock("next/router", () => require("next-router-mock"));
describe("<TrendingSwitch />", () => {
    test("is changing URL properly", async () => {
        mockRouter.push("http://localhost:3000/posts");
        render(<TrendingSwitch />, { wrapper: MemoryRouterProvider });
        const TrendingSwitchWrapper = screen.getByTestId("trending-switch");
        await userEvent.click(TrendingSwitchWrapper.children[0]);
        expect(mockRouter.query.trending).toEqual("6");
        expect(mockRouter.query.page).toEqual("0");

        await userEvent.click(TrendingSwitchWrapper.children[1]);
        expect(mockRouter.query.trending).toEqual("12");
        expect(mockRouter.query.page).toEqual("0");

        await userEvent.click(TrendingSwitchWrapper.children[2]);
        expect(mockRouter.query.trending).toEqual("24");
        expect(mockRouter.query.page).toEqual("0");
    });
});
