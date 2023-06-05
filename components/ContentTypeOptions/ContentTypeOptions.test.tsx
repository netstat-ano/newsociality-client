import { render, screen, fireEvent } from "@testing-library/react";
import ContentTypeOptions from "./ContentTypeOptions";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import mockRouter from "next-router-mock";

jest.mock("next/router", () => require("next-router-mock"));
describe("<ContentTypeOptions />", () => {
    test("changes url to news", () => {
        mockRouter.push("http://localhost/");
        render(<ContentTypeOptions />);
        const select = screen.getByTestId("select");
        fireEvent.change(select, {
            target: {
                value: "news",
            },
        });
        expect(mockRouter.query.type).toContain("news");
    });
    test("changes url to posts", () => {
        mockRouter.push("http://localhost/");
        render(<ContentTypeOptions />);
        const select = screen.getByTestId("select");
        fireEvent.change(select, {
            target: {
                value: "posts",
            },
        });
        expect(mockRouter.query.type).toContain("posts");
    });
    test("changes url to news", () => {
        mockRouter.push("http://localhost/");
        render(<ContentTypeOptions />);
        const select = screen.getByTestId("select");
        fireEvent.change(select, {
            target: {
                value: "news",
            },
        });
        expect(mockRouter.query.type).toContain("news");
    });
});
