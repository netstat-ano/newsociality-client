import { useFormik, FormikErrors } from "formik";
import { NextPage } from "next";
import Head from "next/head";
import InputGroup from "../../../components/auth/InputGroup/InputGroup";
import Card from "../../../components/UI/Card/Card";
import { useRouter } from "next/router";
import SuccessButton from "../../../components/UI/SuccessButton/SuccessButton";
import Wrapper from "../../../components/UI/Wrapper/Wrapper";
import styles from "./Signup.module.scss";
import User from "../../../models/User";
import { useAppDispatch } from "../../../store";
import { userActions } from "../../../store/user";
import useAlert from "../../../hooks/use-alert";
interface FormValues {
    email: string;
    password: string;
    retypePassword: string;
    username: string;
}
const SignupPage: NextPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [alertText, setAlertText, stop] = useAlert(2000);
    const onSubmitHandler = async (values: FormValues) => {
        const user = new User(values.email, values.username, values.password);
        const result = await user.save();
        if (result.ok) {
            dispatch(
                userActions.login({
                    userId: result.userId,
                    token: result.token,
                    avatarUrl: result.avatarUrl,
                    username: result.username,
                })
            );
            User.saveToLocalstorage(
                result.userId!,
                result.token!,
                result.avatarUrl!,
                1,
                result.username!
            );
            router.replace("/");
        } else {
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
        } else if (values.password.length < 8) {
            errors.password = "Hasło musi posiadać co najmniej 8 znaków.";
        }

        if (!values.username) {
            errors.username = "Nazwa użytkownika jest konieczna.";
        } else if (values.username.trim().length < 4) {
            errors.username =
                "Nazwa użytkownika musi mieć co najmniej 4 znaki.";
        }

        if (!values.retypePassword) {
            errors.retypePassword = "Powtórzenia hasła jest konieczne.";
        } else if (values.password !== values.retypePassword) {
            errors.retypePassword = "Hasła muszą się zgadzać.";
        }
        return errors;
    };
    const formik = useFormik({
        initialValues: {
            email: "",
            retypePassword: "",
            password: "",
            username: "",
        },
        onSubmit: onSubmitHandler,
        validate: onValidateHandler,
    });
    return (
        <Wrapper>
            <Card className={styles["signup"]}>
                <>
                    <Head>
                        <title>Rejestracja</title>
                    </Head>
                    <h1>Rejestracja</h1>
                    <form onSubmit={formik.handleSubmit}>
                        <InputGroup
                            inputId="email"
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={formik.errors.email}
                            touched={formik.touched.email}
                            label={"E-mail"}
                        />
                        <InputGroup
                            inputId="username"
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={formik.errors.username}
                            touched={formik.touched.username}
                            label={"Nazwa użytkownika"}
                        />
                        <InputGroup
                            inputId="password"
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={formik.errors.password}
                            touched={formik.touched.password}
                            label={"Hasło"}
                            type={"password"}
                        />

                        <InputGroup
                            inputId="retypePassword"
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            error={formik.errors.retypePassword}
                            touched={formik.touched.retypePassword}
                            type={"password"}
                            label={"Powtórz hasło"}
                        />
                        <SuccessButton button={{ type: "submit" }}>
                            Zarejestruj się
                        </SuccessButton>
                    </form>
                </>
            </Card>
        </Wrapper>
    );
};
export default SignupPage;
