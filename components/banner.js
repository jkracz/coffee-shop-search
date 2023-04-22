import styles from "./banner.module.css";

const Banner = (props) => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                <span className={styles.title1}>Coffee Shop</span>
                <span className={styles.title2}>Search</span>
            </h1>
            <p className={styles.subTitle}>Discover your local coffee stores!</p>
            <div className={styles.buttonWrapper}>
                <button className={styles.button} onClick={props.handleOnClick}>
                    {props.buttonText}
                </button>
            </div>
        </div>
    );
};

export default Banner;