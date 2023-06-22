import { useEffect, useState } from "react";
import useAlert from "../../../hooks/use-alert";
import PostDB from "../../../models/PostDB";
import { useAppSelector } from "../../../store";
import ModalPortal from "../../Modal/Modal";
import SuccessButton from "../../UI/SuccessButton/SuccessButton";
import styles from "./TagBanner.module.scss";
import UserDB from "../../../models/UserDB";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
const TagBanner: React.FC<{ tag: string }> = (props) => {
    const token = useAppSelector((state) => state.user.token);
    const userId = useAppSelector((state) => state.user.userId);
    const [alertText, setAlertText, stop] = useAlert(2000);
    const [isFollowedTag, setIsFollowedTag] = useState<boolean | undefined>();

    useEffect(() => {
        const fetchFollowedStatus = async () => {
            const result = await UserDB.getFollowedTagsById(token!, userId!);
            if (result.ok) {
                if (result.tags.indexOf(props.tag) !== -1) {
                    setIsFollowedTag(true);
                } else {
                    setIsFollowedTag(false);
                }
            } else {
                setAlertText(result.message);
                stop();
            }
        };
        fetchFollowedStatus();
    }, []);

    const onFollowTag = async () => {
        const result = await PostDB.followTag(props.tag, token!);
        if (!result.ok) {
            setAlertText(result.message);
            stop();
        } else {
            setIsFollowedTag((state) => !state);
        }
    };
    return (
        <div className={styles["tag-banner"]}>
            {alertText && (
                <ModalPortal colorsScheme="error">{alertText}</ModalPortal>
            )}
            {isFollowedTag !== undefined && (
                <>
                    <div>
                        <h1>#{props.tag}</h1>
                    </div>
                    <div>
                        <SuccessButton button={{ onClick: onFollowTag }}>
                            <>
                                {isFollowedTag && (
                                    <>
                                        Obserwowane{" "}
                                        <FontAwesomeIcon
                                            className={
                                                styles["check-animation"]
                                            }
                                            icon={faCheck}
                                            fade
                                        />
                                    </>
                                )}
                                {!isFollowedTag && <>Obserwuj tag</>}
                            </>
                        </SuccessButton>
                    </div>
                </>
            )}
        </div>
    );
};
export default TagBanner;
