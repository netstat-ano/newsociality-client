import { useRouter } from "next/router";
import styles from "./ContentTypeOptions.module.scss";
import Link from "next/link";
const ContentTypeOptions: React.FC<{ beforeAddingParams?: () => void }> = (
    props
) => {
    const router = useRouter();
    const onContentTypeChangeHandler = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        if (props.beforeAddingParams) {
            props.beforeAddingParams();
        }
        router.query.type = e.target.value;
        router.push(router);
    };
    return (
        <div className={styles["select-wrapper"]}>
            <select
                data-testid="select"
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
