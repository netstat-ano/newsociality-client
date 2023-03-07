import { useState, useEffect } from "react";
const useAlert = (
    timeout: number
): [string, React.Dispatch<React.SetStateAction<string>>, () => void] => {
    const [alertText, setAlertText] = useState("");

    const stop = () => {
        setTimeout(() => {
            setAlertText("");
        }, timeout);
    };

    return [alertText, setAlertText, stop];
};
export default useAlert;
