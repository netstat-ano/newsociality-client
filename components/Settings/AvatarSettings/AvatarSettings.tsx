import UserDB from "../../../models/UserDB";
import { useAppDispatch, useAppSelector } from "../../../store";
import PostImage from "../../Posts/PostImage/PostImage";
import styles from "./AvatarSettings.module.scss";
import { userActions } from "../../../store/user";
const AvatarSettings: React.FC<{}> = () => {
    const avatarUrl = useAppSelector((state) => state.user.avatarUrl);
    const user = useAppSelector((state) => state.user);
    const token = useAppSelector((state) => state.user.token);
    const dispatch = useAppDispatch();
    const onChangeAvatarHandler = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        console.log(e.target.files);
        if (e.target.files && e.target.files.length > 0) {
            const userDB = new UserDB(user.userId!, user.username!, avatarUrl!);
            const result = await userDB.changeAvatar(token!, e.target.files[0]);
            dispatch(userActions.changeAvatar({ avatar: result.path }));
        }
    };

    return (
        <div>
            <div className="center">
                <h3>Ustawienia zdjęcia profilowego</h3>
            </div>
            <div className={`${styles["avatar-settings__avatar-url"]} center`}>
                <img src={`${process.env.API_URL}/${avatarUrl}`}></img>
            </div>
            <div className="center">
                <label htmlFor="newAvatar">
                    <span
                        className={styles["avatar-settings__change-avatar-btn"]}
                    >
                        Zmień zdjęcie
                    </span>
                </label>
                <input
                    id="newAvatar"
                    name="newAvatar"
                    onChange={onChangeAvatarHandler}
                    className="display-none"
                    type="file"
                />
            </div>
        </div>
    );
};
export default AvatarSettings;
