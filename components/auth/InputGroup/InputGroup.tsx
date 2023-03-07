import Input from "../../UI/Input/Input";
import { ChangeEvent, FocusEvent } from "react";
import InputErrorMessage from "../../UI/InputErrorMessage/InputErrorMessage";
const InputGroup: React.FC<{
    handleChange: (e: ChangeEvent<any>) => any;
    handleBlur: (e: FocusEvent<any, Element>) => any;
    error: string | undefined;
    touched: boolean | undefined;
    label: string;
    inputId: string;
    type?: string;
}> = (props) => {
    return (
        <>
            <label htmlFor={props.inputId}>{props.label}</label>
            <br></br>
            <Input
                input={{
                    type: props.type || "text",
                    placeholder: props.label,
                    id: props.inputId,
                    onChange: props.handleChange,
                    onBlur: props.handleBlur,
                }}
                invalid={Boolean(props.touched && props.error)}
            />
            {props.touched && props.error && (
                <InputErrorMessage message={props.error} />
            )}
            <br></br>
        </>
    );
};
export default InputGroup;
