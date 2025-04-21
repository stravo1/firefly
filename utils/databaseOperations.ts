import { Database, get, ref, set } from 'firebase/database';

export const getData = async (db: Database, collection: string, reference: string) => {
    try {
        const dbRef = ref(db, `${collection}/${reference}`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.log('No data available at this reference:', reference);
            return null;
        }
    } catch (error) {
        console.error('Error getting data:', error);
        return null;
    }
};

export const setData = async (db: Database, collection: string, reference: string, data: any) => {
    try {
        // check if data already exists on specified reference and set only if it doesn't
        const dbRef = ref(db, `${collection}/${reference}`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            console.log('Data already exists at this reference:', reference);
            return;
        }
        await set(dbRef, data);
    } catch (error) {
        console.error('Error setting data:', error);
    }
};

export const updateData = async (db: Database, collection: string, reference: string, data: any) => {
    try {
        const dbRef = ref(db, `${collection}/${reference}`);
        await set(dbRef, data);
    } catch (error) {
        console.error('Error updating data:', error);
    }
}

export const deleteData = async (db: Database, collection: string, reference: string) => {
    try {
        const dbRef = ref(db, `${collection}/${reference}`);
        await set(dbRef, null);
    } catch (error) {
        console.error('Error deleting data:', error);
    }
};