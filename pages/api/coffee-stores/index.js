import { fetchCoffeeStores } from "@/lib/coffee-stores"

import { base, getFields, filterById } from "@/lib/airtable";

export default async function handler(req, res) {
    const { query, method } = req;
    switch (method) {
        case 'GET':
            try {
                const { latLong, limit } = query;
                const response = await fetchCoffeeStores(latLong, limit);
                res.status(200).json(response);
            } catch (error) {
                console.error("there was an error");
                res.status(500).json({ message: "there was a server error", error })
            }
            break;
        case 'POST':
            try {
                const { id, name, address, imgUrl, locality } = req.body;
                if (!id) {
                    res.status(400).json({message: 'an id must be provided'})
                }
                const existingStore = await filterById(id);

                if (existingStore.length > 0) {
                    res.status(200).json(existingStore);
                }
                else {
                    if (name) {
                        const newRecords = await base('coffee-stores').create([{
                            fields: {
                                id,
                                name,
                                address,
                                imgUrl,
                                locality,
                                voting: 0,
                            }
                        }])
                        const jF = getFields(newRecords);
                        res.status(200).json(jF);
                    }
                    else {
                        res.status(400).json({message: "name is missing"});
                    }
                }

            } catch (error) {
                console.error("there was an error");
                res.status(500).json({ message: "there was a server error", error })
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}