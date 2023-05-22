import Avatar from "../../User/Avatar/Avatar";
import styles from "./PostCreator.module.scss";
import Textarea from "../../UI/Textarea/Textarea";
import Card from "../../UI/Card/Card";
import SuccessButton from "../../UI/SuccessButton/SuccessButton";
import { useFormik } from "formik";
import InputErrorMessage from "../../UI/InputErrorMessage/InputErrorMessage";
import { FormikErrors } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import Post from "../../../models/Post";
import { useAppSelector } from "../../../store";
import useAlert from "../../../hooks/use-alert";
import ModalPortal from "../../Modal/Modal";
import { useRouter } from "next/router";
interface FormValues {
    postText: string;
}
const PostCreator: React.FC<{}> = () => {
    const [filename, setFilename] = useState("");
    const [alertText, setAlertText, stop] = useAlert(2000);
    const avatarUrl = useAppSelector((state) => state.user.avatarUrl);
    const router = useRouter();
    const inputAttachmentRef = useRef<HTMLInputElement>(null);
    const token = useAppSelector((state) => state.user.token);
    const userId = useAppSelector((state) => state.user.userId);
    const onSubmitHandler = async (values: FormValues) => {
        const regexp = /(#[A-z0-9])\w+/g;
        const tags = [
            ...Array.from(values.postText.matchAll(regexp), (tag) => tag[0]),
        ];
        if (
            inputAttachmentRef.current &&
            inputAttachmentRef.current!.files &&
            inputAttachmentRef.current!.files.length > 0
        ) {
            var post = new Post(
                userId!,
                values.postText,
                inputAttachmentRef.current.files[0],
                tags
            );
        } else {
            if (
                inputAttachmentRef.current?.files &&
                inputAttachmentRef.current?.files.length > 0
            ) {
                var post = new Post(
                    userId!,
                    values.postText,
                    inputAttachmentRef.current?.files[0],
                    tags
                );
            } else {
                var post = new Post(userId!, values.postText, undefined, tags);
            }
        }
        const result = await post.save(token!);
        if (result.ok) {
            router.push(`/post/${result.postId}`);
        }
        if (!result.ok) {
            setAlertText(result.message);
            stop();
        }
    };
    const onValidateHandler = async (values: FormValues) => {
        const errors: FormikErrors<FormValues> = {};

        if (values.postText.trim().length < 8) {
            errors.postText = "Wpis musi zawierać conajmniej 8 znaków.";
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            postText: "",
        },
        onSubmit: onSubmitHandler,
        validate: onValidateHandler,
    });
    const onAttachmentInputHandler = (e: React.FormEvent<HTMLInputElement>) => {
        const tgt = e.target as HTMLInputElement;

        if (tgt.files && tgt.files.length > 0) {
            setFilename(tgt.files[0].name);
        }
    };

    const onAttachmentReset = () => {
        inputAttachmentRef.current!.value = "";
        setFilename("");
    };
    return (
        <Card className={styles["post-creator"]}>
            <form onSubmit={formik.handleSubmit}>
                {alertText && (
                    <ModalPortal colorsScheme="error">{alertText}</ModalPortal>
                )}
                <div className={styles["post-creator__img"]}>
                    <Avatar src={`${process.env.API_URL}/${avatarUrl}`} />
                </div>
                <div>
                    <Textarea
                        textarea={{
                            placeholder: "Treść wpisu...",
                            rows: "8",
                            cols: "30",
                            className: styles["post-creator__textarea"],
                            onInput: formik.handleChange,
                            value: formik.values.postText,
                            onBlur: formik.handleBlur,
                            id: "postText",
                            name: "postText",
                        }}
                        invalid={Boolean(
                            formik.errors.postText && formik.touched.postText
                        )}
                    />
                    {formik.errors.postText && formik.touched.postText && (
                        <InputErrorMessage message={formik.errors.postText} />
                    )}
                </div>
                <div className={styles["post-creator__attachment"]}>
                    <label htmlFor="post-attachment">
                        <FontAwesomeIcon icon={faPaperclip} />
                    </label>
                    <input
                        ref={inputAttachmentRef}
                        style={{ display: "none" }}
                        accept="image/*"
                        onInput={onAttachmentInputHandler}
                        type="file"
                        id="post-attachment"
                    ></input>
                    <span
                        className={styles["post-creator__attachmnet__filename"]}
                    >
                        {filename}
                    </span>
                    {filename && (
                        <span
                            className={
                                styles["post-creator__attachmnet__reset"]
                            }
                        >
                            <FontAwesomeIcon
                                onClick={onAttachmentReset}
                                icon={faXmarkCircle}
                            />
                        </span>
                    )}
                </div>
                <div className={styles["post-creator__btn"]}>
                    <SuccessButton button={{ type: "submit" }}>
                        Dodaj wpis
                    </SuccessButton>
                </div>
            </form>
        </Card>
    );
};
export default PostCreator;
