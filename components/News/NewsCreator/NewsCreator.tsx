import Card from "../../UI/Card/Card";
import { Formik } from "formik";
import styles from "./NewsCreator.module.scss";
import ModalPortal from "../../Modal/Modal";
import Input from "../../UI/Input/Input";
import { useFormik, FormikErrors } from "formik";
import Textarea from "../../UI/Textarea/Textarea";
import Avatar from "../../User/Avatar/Avatar";
import { useAppSelector } from "../../../store";
import InputErrorMessage from "../../UI/InputErrorMessage/InputErrorMessage";
import SuccessButton from "../../UI/SuccessButton/SuccessButton";
import News from "../../../models/News";
import useAlert from "../../../hooks/use-alert";
interface FormValues {
    newsDescription: string;
    newsUrl: string;
}
const NewsCreator: React.FC<{}> = () => {
    const avatarUrl = useAppSelector((state) => state.user.avatarUrl);
    const userId = useAppSelector((state) => state.user.userId);
    const token = useAppSelector((state) => state.user.token);
    const [alertText, setAlertText, stop] = useAlert(2000);
    const onValidateHandler = async (values: FormValues) => {
        const errors: FormikErrors<FormValues> = {};

        if (values.newsDescription.trim().length < 8) {
            errors.newsDescription = "Wpis musi zawierać conajmniej 8 znaków.";
        }
        const regexp = new RegExp(
            /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
        );
        if (!values.newsUrl.match(regexp)) {
            errors.newsUrl = "Nieprawidłowy adres URL.";
        }
        return errors;
    };
    const onSubmitHandler = async (values: FormValues) => {
        const regexp = /(#[A-z0-9])\w+/g;
        const tags = [
            ...Array.from(
                values.newsDescription.matchAll(regexp),
                (tag) => tag[0]
            ),
        ];

        const news = new News(
            userId!,
            values.newsDescription,
            values.newsUrl,
            tags
        );
        const result = await news.save(token!);
        if (!result.ok) {
            setAlertText(result.message);
            stop();
        }
    };
    const formik = useFormik({
        initialValues: {
            newsDescription: "",
            newsUrl: "",
        },
        onSubmit: onSubmitHandler,
        validate: onValidateHandler,
    });

    return (
        <Card className={styles["news-creator"]}>
            <form onSubmit={formik.handleSubmit}>
                {alertText && (
                    <ModalPortal colorsScheme="error">{alertText}</ModalPortal>
                )}
                <div className={styles["news-creator__img"]}>
                    <Avatar src={`${process.env.API_URL}/${avatarUrl}`} />
                </div>
                <div className={styles["news-creator__inputs"]}>
                    <Input
                        input={{
                            placeholder: "URL",
                            value: formik.values.newsUrl,
                            onChange: formik.handleChange,
                            onBlur: formik.handleBlur,
                            id: "newsUrl",
                            name: "newsUrl",
                        }}
                        invalid={Boolean(
                            formik.errors.newsUrl && formik.touched.newsUrl
                        )}
                    ></Input>
                    {formik.errors.newsUrl && formik.touched.newsUrl && (
                        <InputErrorMessage message={formik.errors.newsUrl} />
                    )}
                    <Textarea
                        textarea={{
                            placeholder: "Opis wiadomości",
                            rows: "8",
                            cols: "30",
                            className: styles["post-creator__textarea"],
                            onInput: formik.handleChange,
                            value: formik.values.newsDescription,
                            onBlur: formik.handleBlur,
                            id: "newsDescription",
                            name: "newsDescription",
                        }}
                        invalid={Boolean(
                            formik.errors.newsDescription &&
                                formik.touched.newsDescription
                        )}
                    />
                    {formik.errors.newsDescription &&
                        formik.touched.newsDescription && (
                            <InputErrorMessage
                                message={formik.errors.newsDescription}
                            />
                        )}
                </div>
                <div className={styles["news-creator__btn"]}>
                    <SuccessButton button={{ type: "submit" }}>
                        Dodaj wiadomość
                    </SuccessButton>
                </div>
            </form>
        </Card>
    );
};
export default NewsCreator;
