import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import cls from 'classnames';

import styles from '../../styles/coffee-shop.module.css';
import { fetchCoffeeStores } from "@/lib/coffee-stores";

export async function getStaticProps({ params }) {
    const coffeeShops = await fetchCoffeeStores();

    return {
        props: {
            coffeeStore: coffeeShops.find(coffeeStore => coffeeStore.fsq_id.toString() === params.id)
        }
    }
}

export async function getStaticPaths() {
    const coffeeShops = await fetchCoffeeStores();
    const paths = coffeeShops.map(coffeeStore => {
        return {
            params: { id: coffeeStore.fsq_id.toString() }
        }
    });
    return {
        paths,
        fallback: true,
    }
}

const CoffeeShop = ({ coffeeStore }) => {
    const router = useRouter();

    const { address, neighborhood } = coffeeStore.location;
    console.log(coffeeStore.location);
    const { name } = coffeeStore.categories;
    const imgUrl = '/static/hero-image.png';

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
                    <Image src={imgUrl || 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'} width={600} height={360} className={styles.storeImg} alt={name} />
                </div>
                <div className={cls('glass', styles.col2)}>
                    <div className={styles.iconWrapper}>
                        <Image src='/static/icons/places.svg' width={24} height={24} />
                        <p className={styles.text}>{address}</p>
                    </div>
                    <div className={styles.iconWrapper}>
                        <Image src='/static/icons/nearMe.svg' width={24} height={24} />
                        <p className={styles.text}>{neighborhood}</p>
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