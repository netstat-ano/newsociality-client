import { render, screen } from "@testing-library/react";
import InputGroup from "./InputGroup";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

describe("<InputGroup />", () => {
    test("renders error message", () => {
        render(
            <InputGroup
                error={"error"}
                handleBlur={() => {}}
                handleChange={() => {}}
                touched={true}
                label={"test"}
                inputId={"1"}
            />
        );
        const output = screen.getByText("error");
        expect(output).toBeInTheDocument();
    });
});
