import styles from "./Layout.module.scss";
import Link from "next/link";
import Sidebar from "../UI/Sidebar/Sidebar";
import SuccessButton from "../UI/SuccessButton/SuccessButton";
import BlueButton from "../UI/BlueButton/BlueButton";
import Input from "../UI/Input/Input";
import { useAppSelector } from "../../store";
import CanceledButton from "../UI/CanceledButton/CanceledButton";
import { useAppDispatch } from "../../store";
import { useEffect } from "react";
import User from "../../models/User";
import { userActions } from "../../store/user";
const Layout: React.FC<{ children: JSX.Element }> = (props) => {
    const userId = useAppSelector((state) => state.user.userId);
    const dispatch = useAppDispatch();
    useEffect(() => {
        const user = User.getFromLocalstorage();
        if (user.token && user.userId) {
            dispatch(
                userActions.login({ userId: user.userId, token: user.token })
            );
        }
    }, []);
    const onLogoutHandler = () => {
        User.clearLocalstorage();
        dispatch(userActions.logout());
    };
    return (
        <>
            <header className={styles["layout__banner"]}>
                <div>
                    <Link href="/" className={styles["layout__banner_logo"]}>
                        Newsociality
                    </Link>
                </div>
                <div className={styles["layout__banner__wrapper"]}>
                    <div className={styles["layout__banner_search"]}>
                        <Input
                            input={{ placeholder: "Wyszukaj..." }}
                            invalid={false}
                        />
                    </div>
                    {!userId && (
                        <div className={styles["layout__banner__actions"]}>
                            <Link href={"/auth/login"}>
                                <SuccessButton>Zaloguj się</SuccessButton>
                            </Link>
                            <Link href={"/auth/signup"}>
                                <BlueButton>Zarejestruj się</BlueButton>
                            </Link>
                        </div>
                    )}
                    {userId && (
                        <div className={styles["layout__banner__actions"]}>
                            <CanceledButton
                                button={{ onClick: onLogoutHandler }}
                            >
                                Wyloguj się
                            </CanceledButton>
                        </div>
                    )}
                </div>
            </header>
            <div className={styles["layout__main"]}>
                <Sidebar />
                <div className={styles["layout__main__content"]}>
                    {props.children}
                </div>
            </div>
        </>
    );
};
export default Layout;
