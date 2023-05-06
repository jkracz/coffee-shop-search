import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

import Banner from '@/components/banner'
import Card from '@/components/card.component'

import { fetchCoffeeStores } from '@/lib/coffee-stores'
import useTrackLocation from '@/hooks/use-track-location'
import { useContext, useEffect, useState } from 'react'
import { STORE_ACTION_TYPES, StoreContext } from '@/contexts/store-context'

export async function getStaticProps() {
  const coffeeShops = await fetchCoffeeStores();

  return {
    props: { coffeeShops }
  }
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMessage, isFindingLocation } = useTrackLocation()

  const [coffeShopsByLocationError, setCoffeShopsByLocationError] = useState(null);
  const { dispatch, state } = useContext(StoreContext);
  const { coffeeShops, latLong } = state;

  useEffect(() => {
    const fetchAsyncCoffeShops = async () => {
      if (latLong) {
        try {
          const coffeeShopsByLocationResponse = await fetch(`/api/coffee-stores?latLong=${latLong}&limit=30`);
          const coffeeShopsByLocation = await coffeeShopsByLocationResponse.json();
          dispatch({
            type: STORE_ACTION_TYPES.SET_COFFEE_STORES,
            payload: coffeeShopsByLocation
          })
          setCoffeShopsByLocationError('');
        } catch (error) {
          setCoffeShopsByLocationError(error.message);
        }
      }
    }
    fetchAsyncCoffeShops();
  }), [dispatch, latLong];

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  }

  return (
    <>
      <Head>
        <title>Coffee Shop Search</title>
        <meta name="description" content="Find coffee shops near you" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Coffee Shop Search</h1>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "Find Nearby"}
          handleOnClick={handleOnBannerBtnClick}
        />
        {
          locationErrorMessage && <p>Something went wrong {locationErrorMessage}</p>
        }
        {
          coffeShopsByLocationError && <p>Something went wrong {coffeShopsByLocationError}</p>
        }
        <div className={styles.heroImage}>
          <Image src="/static/hero-image.png" width={500} height={500} alt="abstract coffee cup hero image" />
        </div>
        {coffeeShops.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Cafes Close By</h2>
            <div className={styles.cardLayout}>
              {
                coffeeShops.map((shop) => {
                  return (
                    <Card
                      key={shop.id}
                      className={styles.card}
                      name={shop.name}
                      href={`/coffee-shop/${shop.id}`}
                      imgUrl={shop.imgUrl || 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'}
                    />
                  )
                })
              }
            </div>
          </div>
        )}
        {props.coffeeShops.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Sunnyvale Shops</h2>
            <div className={styles.cardLayout}>
              {
                props.coffeeShops.map((shop) => {
                  return (
                    <Card
                      key={shop.id}
                      className={styles.card}
                      name={shop.name}
                      href={`/coffee-shop/${shop.id}`}
                      imgUrl={shop.imgUrl || 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'}
                    />
                  )
                })
              }
            </div>
          </div>
        )}
      </main>
    </>
  )
}
