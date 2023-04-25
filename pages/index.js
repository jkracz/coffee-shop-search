import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

import Banner from '@/components/banner'
import Card from '@/components/card.component'

import coffeeShopsData from './../data/coffee-stores.json'
import { fetchCoffeeStores } from '@/lib/coffee-stores'

export async function getStaticProps() {
  const coffeeShops = await fetchCoffeeStores();

  return {
    props: { coffeeShops }
  }
}

export default function Home(props) {

  const handleOnBannerBtnClick = () => {
    console.log("yup");
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
          buttonText="Find Nearby"
          handleOnClick={handleOnBannerBtnClick}
        />
        <div className={styles.heroImage}>
          <Image src="/static/hero-image.png" width={500} height={500} />
        </div>
        <h2 className={styles.heading2}>Sunnyvale Shops</h2>
        <div className={styles.cardLayout}>
          {
            props.coffeeShops.map((shop) => {
              return (
                <Card
                  key={shop.fsq_id}
                  className={styles.card}
                  name={shop.name}
                  href={`/coffee-shop/${shop.fsq_id}`}
                  imgUrl={shop.imgUrl || 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'}
                />
              )
            })
          }
        </div>
      </main>
    </>
  )
}
