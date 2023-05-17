import styles from "./TrendingSwitch.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
const TrendingSwitch: React.FC<{}> = () => {
    const router = useRouter();
    return (
        <div>
            {(router.pathname === "/posts" || router.pathname === "/news") && (
                <Link
                    className={
                        router.query.trending === "6"
                            ? styles["trending-link-active"]
                            : ""
                    }
                    href={`${router.pathname}?trending=6&page=0`}
                >
                    Gorące 6h
                </Link>
            )}{" "}
            {(router.pathname === "/posts" || router.pathname === "/news") && (
                <Link
                    className={
                        router.query.trending === "12"
                            ? styles["trending-link-active"]
                            : ""
                    }
                    href={`${router.pathname}?trending=12&page=0`}
                >
                    Gorące 12h
                </Link>
            )}{" "}
            {(router.pathname === "/posts" || router.pathname === "/news") && (
                <Link
                    className={
                        router.query.trending === "24"
                            ? styles["trending-link-active"]
                            : ""
                    }
                    href={`${router.pathname}?trending=24&page=0`}
                >
                    Gorące 24h
                </Link>
            )}
        </div>
    );
};
export default TrendingSwitch;
