import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

import Banner from '@/components/banner'
import Card from '@/components/card.component'

import coffeeShopsData from './../data/coffee-stores.json'

export async function getStaticProps() {
  return {
    props: {coffeeShops: coffeeShopsData}
  }
}

export default function Home(props) {
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
                key={shop.id} 
                className={styles.card}
                name={shop.name}
                href={`/coffee-shop/${shop.id}`} 
                imgUrl={shop.imgUrl}
                />
              ) 
            })
          }
        </div>
      </main>
    </>
  )
}
