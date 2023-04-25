const getCoffeeShopsUrl = (latlong, query, limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&limit=${limit}`
}

export const fetchCoffeeStores = async (context) => {
    const options = { method: 'GET', headers: { accept: 'application/json', authorization: process.env.FOURSQUARE_API_KEY } };
    const response = await fetch(getCoffeeShopsUrl(3, 'coffee', 10), options);
    const data = await response.json();
  
    // .catch(err => console.error(err));
  
    return data.results;
}