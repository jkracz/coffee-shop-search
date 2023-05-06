import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import useSWR from 'swr';

import cls from 'classnames';

import styles from '../../styles/coffee-shop.module.css';
import { fetchCoffeeStores } from "@/lib/coffee-stores";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "@/contexts/store-context";
import { isEmpty } from "@/utils";

export async function getStaticProps({ params }) {
    const coffeeShops = await fetchCoffeeStores();
    const coffeeShop = coffeeShops.find(coffeeStore => coffeeStore.id.toString() === params.id)
    return {
        props: {
            coffeeStore: coffeeShop ? coffeeShop : {}
        }
    }
}

export async function getStaticPaths() {
    const coffeeShops = await fetchCoffeeStores();
    const paths = coffeeShops.map(coffeeStore => {
        return {
            params: { id: coffeeStore.id.toString() }
        }
    });
    return {
        paths,
        fallback: true,
    }
}

const CoffeeShop = (initialProps) => {
    const router = useRouter();
    if (router.isFallback) {
        return (
            <div>LOADING</div>
        )
    }

    const id = router.query.id;

    const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

    const {
        state: {
            coffeeShops
        } 
    } = useContext(StoreContext)

    useEffect(() => {
        const getCoffeeStoreAsync = async () => {
            if (isEmpty(initialProps.coffeeStore)) {
                if (coffeeShops.length > 0) {
                    const coffeeShop = coffeeShops.find(coffeeStore => coffeeStore.id.toString() === id);
                    setCoffeeStore(coffeeShop);
                    await handleCreateCoffeeStore(coffeeShop);
                }
            }
            else {
                // ssg
                await handleCreateCoffeeStore(initialProps.coffeeStore);
            }
        } 
        getCoffeeStoreAsync();
    }, [id, initialProps, initialProps.coffeeStore]);

    const handleCreateCoffeeStore = async (coffeeShop) => {
        try {
            const {
                name,
                voting,
                imgUrl,
                locality,
                address,
                id,
            } = coffeeShop
            const response = await fetch('/api/coffee-stores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    voting,
                    imgUrl,
                    locality: locality || '',
                    address: address || '',
                    id,
                }),
            });

            const dbCoffeeStore = await response.json();
        } catch (error) {
            console.error('error creating coffee store', error)
        }
    }

    const [voteCount, setVoteCount] = useState(0);

    const fetcher = (...args) => fetch(...args).then(res => res.json());
    const { data, error, isLoading } = useSWR(`/api/coffee-stores/${id}`, fetcher);

    useEffect(() => {
        if (data && data.length > 0) {
            console.log(data);
            setCoffeeStore(data[0]);
            setVoteCount(data[0].voting);
        }
    }, [data]);

    const handleUpvoteButton = async() => {
        try {
            const count = voteCount + 1;
            const response = await fetch(`/api/coffee-stores/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    voting: count
                }),
            });
            setVoteCount(count);
        } catch (error) {
            console.error("Issue upvoting the coffee store", error);
        }
    }

    return (
        <div className={styles.layout}>
            <Head>
                <title>{coffeeStore.name}</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.col1}>
                    <div className={styles.backToHomeLink}>
                        <Link href="/">← Back to home</Link>
                    </div>
                    <div className={styles.nameWrapper}>
                        <p className={styles.name}>{coffeeStore.name}</p>
                    </div>
                    <Image src={coffeeStore.imgUrl || 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'} width={600} height={360} className={styles.storeImg} alt={coffeeStore.name} />
                </div>
                <div className={cls('glass', styles.col2)}>
                    {coffeeStore.address !== "" && (
                        <div className={styles.iconWrapper}>
                            <Image src='/static/icons/places.svg' width={24} height={24} alt="places icon" />
                            <p className={styles.text}>{coffeeStore.address}</p>
                        </div>)
                    }
                    <div className={styles.iconWrapper}>
                        <Image src='/static/icons/nearMe.svg' width={24} height={24} alt="locator icon" />
                        <p className={styles.text}>{coffeeStore.locality}</p>
                    </div>
                    <div className={styles.iconWrapper}>
                        <Image src='/static/icons/star.svg' width={24} height={24} alt="star icon" />
                        <p className={styles.text}>{voteCount}</p>
                    </div>
                    <button className={styles.upvoteButton} onClick={handleUpvoteButton}>Up Vote!</button>
                </div>
            </div>
        </div>
    )
}

export default CoffeeShop;