import { useRef, useEffect } from "react";
const useOutsideClick = (callback: () => void) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLDivElement;
            if (ref.current && !ref.current.contains(target)) {
                callback();
            }
        };

        document.addEventListener("click", handleClick, true);

        return () => {
            document.removeEventListener("click", handleClick, true);
        };
    }, [ref]);

    return ref;
};
export default useOutsideClick;
