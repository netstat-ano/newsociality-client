import { useRouter } from "next/router";
import BlueButton from "../BlueButton/BlueButton";
import Link from "next/link";
import styles from "./Pagination.module.scss";
import { useState } from "react";
import DisabledButton from "../DisabledButton/DisabledButton";
const Pagination: React.FC<{ lastPage: boolean }> = (props) => {
    const router = useRouter();
    const [page, setPage] = useState(Number(router.query.page) || 0);
    const onNextPage = () => {
        router.query.page = `${page + 1}`;
        router.push(router);
        setPage((prevState) => prevState + 1);
    };
    const onPreviousPage = () => {
        if (page > 0) {
            router.query.page = `${page - 1}`;
            router.push(router);
            setPage((prevState) => prevState - 1);
        }
    };
    return (
        <div>
            {page !== 0 && (
                <BlueButton button={{ onClick: onPreviousPage }}>
                    Poprzednia
                </BlueButton>
            )}
            {page === 0 && <DisabledButton>Poprzednia</DisabledButton>}
            <span className={styles["page-number"]}>{page + 1}</span>

            {!props.lastPage && (
                <BlueButton
                    button={{ onClick: onNextPage, disabled: props.lastPage }}
                >
                    Następna
                </BlueButton>
            )}
            {props.lastPage && <DisabledButton>Następna</DisabledButton>}
        </div>
    );
};
export default Pagination;
