// This is for all database operation on firestore
// Ridwan (clappedspeed)
import {db} from './firebaseConfig';
import {
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    Timestamp,
} from 'firebase/firestore';


// THE NEXT 3 FUNCTUONS ARE FOR THE USER COLLECTIONS!!!

// This creates a user and is reusable
export const createUser = async (userId, userData) => {
    try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            ...userData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
        console.log('User document has been written down with the ID: ', userID);
    } catch (e) {
        console.error('Issues with adding user documents: ', e);
        throw e;
    }
};

// this function gets the user id from the collection
export const getUser = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return { id: userSnap.id, ...userSnap.data() };
        } else 
        {
            console.log('User dont exist');
            return null;
        }
    }

    catch (e)
     {
        console.error('Error getting user docs: ', e);
        throw e;

    }


        }


export const updateUser = async (user,id, updateData) => 
{
    try 
    {
        const userRef = doc(db, 'users', userID);
        await updateDoc(userRef, 
            {...updateData, updatedAt: Timestamp.now(),
            });
            console.log('user document has been updated. ID: ', userID);
    }
    catch (e) 
    {
        console.error('issue updating user docs: ', e);
        throw e;
    }
};


export const addLocation = async (locationData) => 
{
    try 
    {
        const locationRef = await addDoc(collection(db, 'locations'), 
        {
            ...locationsData,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),

        });
        console.log('location documents were wirtten with ID:', locationsRef.id);
        return locationsRef.id;
    }
    catch (e)
    {
        console.error("error adding the location: ", e);
        throw e;
    }




};


export const getAllLocations = async () => 
{
    try
    {
        const locationsCol = collection(db, 'locations');
        const locationSnapshop = await getDocs(locationsCol);
        const locationList = locationSnapshot.docs.map(doc => ({id: doc.id, ...doc.data() }));
        return locationList;

    }
    catch (e) 
    {
        console.error('error getting locations: ', e);
        throw e;
    }
};


export const getLocation = async (locationId) =>
{
    try
    {
        const locationRef = doc(db, 'locations', locationId);
        const locationSnap = await getDoc(locationRef);
        if (locationSnap.exists())
        {
            return { id: locationSnap.id, ...locationSnap.data()};
        }
        else
        {
            console.log('such location does not exist');
            return null;

        }

    }
    catch (e) 
    {
        console.error('error getting the doc for locations;', e);
        throw e;
    }

}
 
export const addCheckIn = async (userId, locationId) => 
    {
        try
        {
            const checkInRef = await addDoc(collection(db, 'checkIns'),
            {
                userId,
                locationID,
                timestamp: Timestamp.now(),
            });
            console.log('check in has been successfully added with ID: ',checkInRef.id);
            return checkInRef.id;
    
        }
        catch (e) 
        {
            console.error('error adding the check in: ', e);
            throw e;
        }




    };


export const getUserCheckIns = async (userId) => {
    try {
        const checkInsCol = collection(db, 'checkIns');
        const q = query(checkInsCol, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const checkIns = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return checkIns;
    } catch (e) {
        console.error('Error getting user check-ins: ', e);
        throw e;
    }
    };
    
    export const getLocationCheckIns = async (locationId) => {
    try {
        const checkInsCol = collection(db, 'checkIns');
        const q = query(checkInsCol, where('locationId', '==', locationId));
        const querySnapshot = await getDocs(q);
        const checkIns = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return checkIns;
    } catch (e) {
        console.error('Error getting location check-ins: ', e);
        throw e;
    }
    };
    



