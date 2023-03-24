import Avatar from "../../User/Avatar/Avatar";
import styles from "./CommentCreator.module.scss";
import Textarea from "../../UI/Textarea/Textarea";
import Card from "../../UI/Card/Card";
import SuccessButton from "../../UI/SuccessButton/SuccessButton";
import { FormikBag, FormikHelpers, useFormik } from "formik";
import InputErrorMessage from "../../UI/InputErrorMessage/InputErrorMessage";
import { FormikErrors } from "formik";
import { CommentResponse } from "../../../models/Post";
import { useAppSelector } from "../../../store";
import useAlert from "../../../hooks/use-alert";
import { useState, useRef } from "react";
import ModalPortal from "../../Modal/Modal";
import Comment from "../../../models/Comment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
interface FormValues {
    commentText: string;
}
const CommentCreator: React.FC<{
    postId: string;
    setComments: React.Dispatch<React.SetStateAction<CommentResponse[]>>;
    comments?: CommentResponse[];
}> = (props) => {
    const [alertText, setAlertText, stop] = useAlert(2000);
    const avatarUrl = useAppSelector((state) => state.user.avatarUrl);
    const token = useAppSelector((state) => state.user.token);
    const userId = useAppSelector((state) => state.user.userId);
    const username = useAppSelector((state) => state.user.username);
    const [filename, setFilename] = useState("");
    const inputAttachmentRef = useRef<HTMLInputElement>(null);
    const onSubmitHandler = async (
        values: FormValues,
        actions: FormikHelpers<FormValues>
    ) => {
        if (
            inputAttachmentRef.current?.files &&
            inputAttachmentRef.current?.files.length > 0
        ) {
            var comment = new Comment(
                userId!,
                values.commentText,
                props.postId,
                inputAttachmentRef.current?.files[0]
            );
        } else {
            var comment = new Comment(
                userId!,
                values.commentText,
                props.postId
            );
        }
        const result = await comment.save(token!);
        if (!result.ok) {
            setAlertText(result.message);
            stop();
        } else {
            actions.resetForm();
            props.setComments((prevState) => {
                return [
                    ...prevState,
                    {
                        userId: {
                            _id: userId!,
                            username: username!,
                            avatarUrl: avatarUrl!,
                        },
                        commentText: comment.commentText,
                        createdAt: result.addedComment!.createdAt,
                        updatedAt: result.addedComment!.updatedAt,
                        _id: result.addedComment!._id,
                        imageUrl: result.addedComment?.imageUrl,
                    },
                ];
            });
        }
    };
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
    const onValidateHandler = async (values: FormValues) => {
        const errors: FormikErrors<FormValues> = {};

        if (values.commentText.trim().length < 4) {
            errors.commentText = "Komentarz musi zawierać conajmniej 4 znaki.";
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            commentText: "",
        },
        onSubmit: onSubmitHandler,
        validate: onValidateHandler,
    });

    return (
        <Card className={styles["post-creator"]}>
            <form onSubmit={formik.handleSubmit}>
                {alertText && (
                    <ModalPortal colorsScheme="error">{alertText}</ModalPortal>
                )}
                <div className={styles["comment-creator__img"]}>
                    <Avatar src={`${process.env.API_URL}/${avatarUrl}`} />
                </div>
                <div>
                    <Textarea
                        className={styles["comment-creator__textarea"]}
                        textarea={{
                            rows: "4",
                            onInput: formik.handleChange,
                            value: formik.values.commentText,
                            onBlur: formik.handleBlur,
                            id: "commentText",
                            name: "commentText",
                        }}
                        invalid={Boolean(
                            formik.errors.commentText &&
                                formik.touched.commentText
                        )}
                    />
                    {formik.errors.commentText &&
                        formik.touched.commentText && (
                            <InputErrorMessage
                                message={formik.errors.commentText}
                            />
                        )}
                </div>
                <div className={styles["comment-creator__attachment"]}>
                    <label htmlFor="comment-attachment">
                        <FontAwesomeIcon icon={faPaperclip} />
                    </label>
                    <input
                        ref={inputAttachmentRef}
                        style={{ display: "none" }}
                        accept="image/*"
                        onInput={onAttachmentInputHandler}
                        type="file"
                        id="comment-attachment"
                    ></input>
                    <span
                        className={
                            styles["comment-creator__attachmnet__filename"]
                        }
                    >
                        {filename}
                    </span>
                    {filename && (
                        <span
                            className={
                                styles["comment-creator__attachmnet__reset"]
                            }
                        >
                            <FontAwesomeIcon
                                onClick={onAttachmentReset}
                                icon={faXmarkCircle}
                            />
                        </span>
                    )}
                </div>
                <div className={styles["comment-creator__btn"]}>
                    <SuccessButton button={{ type: "submit" }}>
                        Dodaj komentarz
                    </SuccessButton>
                </div>
            </form>
        </Card>
    );
};
export default CommentCreator;
