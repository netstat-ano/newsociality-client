import styles from "./Layout.module.scss";
import Link from "next/link";
import Sidebar from "../UI/Sidebar/Sidebar";
import SuccessButton from "../UI/SuccessButton/SuccessButton";
import BlueButton from "../UI/BlueButton/BlueButton";
import Input from "../UI/Input/Input";
import { useAppSelector } from "../../store";
import CanceledButton from "../UI/CanceledButton/CanceledButton";
import { useAppDispatch } from "../../store";
import { useEffect, useState } from "react";
import User from "../../models/User";
import { userActions } from "../../store/user";
import Avatar from "../User/Avatar/Avatar";
import ContextMenu from "../UI/ContextMenu/ContextMenu";
import { FormikBag, useFormik } from "formik";
import { useRouter } from "next/router";
interface FormValues {
    searchingValue: string;
}
const Layout: React.FC<{ children: JSX.Element }> = (props) => {
    const userId = useAppSelector((state) => state.user.userId);
    const userAvatar = useAppSelector((state) => state.user.avatarUrl);
    const [isMenuToggled, setIsMenuToggled] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();
    useEffect(() => {
        const user = User.getFromLocalstorage();
        if (user.token && user.userId) {
            dispatch(
                userActions.login({
                    userId: user.userId,
                    token: user.token,
                    avatarUrl: user.avatarUrl,
                    username: user.username,
                })
            );
        }
    }, []);
    const onLogoutHandler = () => {
        setIsMenuToggled(false);
        User.clearLocalstorage();
        dispatch(userActions.logout());
    };
    const onToggleMenuHandler = () => {
        setIsMenuToggled((prevState) => !prevState);
    };
    const onSubmitHandler = (values: FormValues) => {
        router.push(`/tag/${values.searchingValue}`);
    };
    const formik = useFormik({
        initialValues: {
            searchingValue: "",
        },
        onSubmit: onSubmitHandler,
    });
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
                        <BlueButton
                            className={styles["layout__banner_search__btn"]}
                        >
                            <Link href="/posts?trending=6h">Wpisy</Link>
                        </BlueButton>
                        <form
                            className={styles["layout__banner_search__form"]}
                            onSubmit={formik.handleSubmit}
                        >
                            <Input
                                input={{
                                    placeholder: "Wyszukaj...",
                                    onChange: formik.handleChange,
                                    onBlur: formik.handleBlur,
                                    name: "searchingValue",
                                }}
                                invalid={false}
                            />
                            <button
                                style={{ display: "none" }}
                                type="submit"
                            ></button>
                        </form>
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
                        <div className={styles["layout__banner__actions-user"]}>
                            <Avatar
                                img={{ onClick: onToggleMenuHandler }}
                                src={`${process.env.API_URL}/${userAvatar}`}
                            />
                        </div>
                    )}
                    {isMenuToggled && (
                        <ContextMenu>
                            <>
                                <li onClick={onLogoutHandler}>Wyloguj się</li>
                            </>
                        </ContextMenu>
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
