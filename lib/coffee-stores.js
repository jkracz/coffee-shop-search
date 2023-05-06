import { createApi } from 'unsplash-js';

// on server
const unsplash = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
    //...other fetch options
});

const getCoffeeShopsUrl = (latlong, query, limit) => {
    return `https://api.foursquare.com/v3/places/search?ll=${latlong}&query=${query}&limit=${limit}`
}

const getCoffeeShopPics = async () => {
    const res = await unsplash.search.getPhotos({
        query: 'coffee shop',
        page: 1,
        perPage: 30,
    });
    const results = res.response.results;

    return results.map(
        (result) => result.urls['small']
    );
}

export const fetchCoffeeStores = async (latLong = '37.3873519%2C-121.9945749', limit = 6) => {
    const options = { method: 'GET', headers: { accept: 'application/json', authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY } };
    const response = await fetch(getCoffeeShopsUrl(latLong, 'coffee', limit), options);
    const data = await response.json();
    const photos = await getCoffeeShopPics();

    const coffeeShops = data.results.map(
        (result, indx) => {
            return {
                name: result.name,
                id: result.fsq_id,
                address: result.location.address || '',
                locality: result.location.locality,
                imgUrl: photos[indx]
            }
        }
    );
    return coffeeShops;
}