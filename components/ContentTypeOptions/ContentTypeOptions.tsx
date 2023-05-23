import { useRouter } from "next/router";
import styles from "./ContentTypeOptions.module.scss";
import Link from "next/link";
const ContentTypeOptions: React.FC<{}> = () => {
    const router = useRouter();
    const onContentTypeChangeHandler = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        router.query.type = e.target.value;
        router.push(router);
    };
    return (
        <div className={styles["select-wrapper"]}>
            <select
                onChange={onContentTypeChangeHandler}
                className={styles.select}
            >
                <option value="posts">Wpisy</option>
                <option value="news">Wiadomości</option>
            </select>
        </div>
    );
};
export default ContentTypeOptions;
