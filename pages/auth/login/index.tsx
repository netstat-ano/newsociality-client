import { useFormik, FormikErrors } from "formik";
import { NextPage } from "next";
import Head from "next/head";
import InputGroup from "../../../components/auth/InputGroup/InputGroup";
import Card from "../../../components/UI/Card/Card";
import { useAppDispatch } from "../../../store";
import SuccessButton from "../../../components/UI/SuccessButton/SuccessButton";
import Wrapper from "../../../components/UI/Wrapper/Wrapper";
import User from "../../../models/User";
import styles from "./Login.module.scss";
import { userActions } from "../../../store/user";
import useAlert from "../../../hooks/use-alert";
import ModalPortal from "../../../components/Modal/Modal";
import { useRouter } from "next/router";
import { useRef } from "react";
interface FormValues {
    email: string;
    password: string;
}
const LoginPage: NextPage = () => {
    const dispatch = useAppDispatch();
    const [alertText, setAlertText, stop] = useAlert(2000);
    const router = useRouter();
    const checkboxRef = useRef<HTMLInputElement>(null);
    const onSubmitHandler = async (values: FormValues) => {
        const user = new User(values.email, null, values.password);
        if (checkboxRef.current?.checked) {
            var result = await user.login(24 * 365 * 10);
        } else {
            var result = await user.login();
        }
        if (result.ok) {
            dispatch(
                userActions.login({
                    userId: result.userId,
                    token: result.token,
                    avatarUrl: result.avatarUrl,
                    username: result.username,
                })
            );
            if (checkboxRef.current?.checked) {
                User.saveToLocalstorage(
                    result.userId!,
                    result.token!,
                    result.avatarUrl!,
                    24 * 365 * 10,
                    result.username!
                );
            } else {
                User.saveToLocalstorage(
                    result.userId!,
                    result.token!,
                    result.avatarUrl!,
                    1,
                    result.username!
                );
            }
            router.replace("/");
        } else {
            console.log(result.message);

            setAlertText(result.message);
            stop();
        }
    };
    const onValidateHandler = (values: FormValues) => {
        let errors: FormikErrors<FormValues> = {};
        if (!values.email) {
            errors.email = "E-mail jest konieczny.";
        } else if (
            !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email)
        ) {
            errors.email = "Nieprawidłowy e-mail.";
        }
        if (!values.password) {
            errors.password = "Hasło jest konieczne.";
        }
        return errors;
    };
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: onSubmitHandler,
        validate: onValidateHandler,
    });
    return (
        <Wrapper>
            <Card className={styles["login"]}>
                <>
                    <Head>
                        <title>Logowanie</title>
                    </Head>
                    {alertText && (
                        <ModalPortal colorsScheme="error">
                            {alertText}
                        </ModalPortal>
                    )}
                    <h1>Logowanie</h1>
                    <form onSubmit={formik.handleSubmit}>
                        <InputGroup
                            inputId="email"
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={formik.errors.email}
                            label="E-mail"
                            touched={formik.touched.email}
                        />
                        <InputGroup
                            inputId="password"
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={formik.errors.password}
                            label="Hasło"
                            type={"password"}
                            touched={formik.touched.password}
                        />
                        <div className={styles["login__options"]}>
                            <input
                                ref={checkboxRef}
                                name="notLogout"
                                type="checkbox"
                            ></input>
                            <label htmlFor="notLogout">
                                Nie wylogowuj mnie
                            </label>
                        </div>
                        <SuccessButton button={{ type: "submit" }}>
                            Zaloguj się
                        </SuccessButton>
                    </form>
                </>
            </Card>
        </Wrapper>
    );
};
export default LoginPage;
