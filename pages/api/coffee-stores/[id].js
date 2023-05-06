import { base, getFields, filterById } from "@/lib/airtable";

export default async function handler(req, res) {
    const { query, method } = req;
    const { id } = query;
    if (!id) {
        res.status(400).json({ message: 'an id must be provided' })
    }
    switch (method) {
        case 'GET':
            try {
                const existingStore = await filterById(id);
                if (existingStore.length > 0) {
                    res.status(200).json(existingStore);
                }
                else {
                    res.status(400).json({ message: 'id could not be found' })
                }
            } catch (error) {
                console.error('there was an error', error);
                res.status(500).json({ message: 'there was an error' })
            }
            break;
        case 'PATCH':
            try {
                const existingStore = await filterById(id);
                if (existingStore.length > 0) {
                    const updatedRecord = await base('coffee-stores').update(existingStore[0].recordId, req.body);
                    res.status(200).json({...updatedRecord.fields});
                }
            } catch (error) {
                console.error('there was an error', error);
                res.status(500).json({ message: 'there was an error' })
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PATCH'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}