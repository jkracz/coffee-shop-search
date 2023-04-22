import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import cls from 'classnames';

import coffeShopsData from '../../data/coffee-stores.json';
import styles from '../../styles/coffee-shop.module.css';

export function getStaticProps({ params }) {
    return {
        props: {
            coffeeStore: coffeShopsData.find(coffeeStore => coffeeStore.id.toString() === params.id)
        }
    }
}

export function getStaticPaths() {
    const paths = coffeShopsData.map(coffeeStore => {
        return {
            params: { id: coffeeStore.id.toString() }
        }
    });
    return {
        paths,
        fallback: true,
    }
}

const CoffeeShop = ({ coffeeStore: { address, name, neighbourhood, imgUrl } }) => {
    const router = useRouter();

    if (router.isFallback) {
        return (
            <div>LOADING</div>
        )
    }

    const handleUpvoteButton = () => console.log("upvote!")

    return (
        <div className={styles.layout}>
            <Head>
                <title>{name}</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.col1}>
                    <div className={styles.backToHomeLink}>
                        <Link href="/">Back to home</Link>
                    </div>
                    <div className={styles.nameWrapper}>
                        <p className={styles.name}>{name}</p>
                    </div>
                    <Image src={imgUrl} width={600} height={360} className={styles.storeImg} alt={name} />
                </div>
                <div className={cls('glass', styles.col2)}>
                    <div className={styles.iconWrapper}>
                        <Image src='/static/icons/places.svg' width={24} height={24} />
                        <p className={styles.text}>{address}</p>
                    </div>
                    <div className={styles.iconWrapper}>
                        <Image src='/static/icons/nearMe.svg' width={24} height={24} />
                        <p className={styles.text}>{neighbourhood}</p>
                    </div>
                    <div className={styles.iconWrapper}>
                        <Image src='/static/icons/star.svg' width={24} height={24} />
                        <p className={styles.text}>1</p>
                    </div>
                    <button className={styles.upvoteButton} onClick={handleUpvoteButton}>Up Vote!</button>
                </div>
            </div>
        </div>
    )
}

export default CoffeeShop;