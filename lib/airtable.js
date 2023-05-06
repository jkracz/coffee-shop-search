const Airtable = require('airtable');
export const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

const getSingleRecord = (record) => {
    return {
        recordId: record.id,
        ...record.fields
    }
}

export const getFields = (records) => {
    return records.map((record) => getSingleRecord(record));
}


export const filterById = async (id) => {
    const record = await base('coffee-stores').select({
        filterByFormula: `id="${id}"`
    }).firstPage();

    return getFields(record);
}
