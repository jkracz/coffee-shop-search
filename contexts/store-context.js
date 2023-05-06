import { createContext, useReducer } from 'react';

export const STORE_ACTION_TYPES = {
    SET_LAT_LONG: 'SET_LAT_LONG',
    SET_COFFEE_STORES: 'SET_COFFEE_STORES',
}

export const StoreContext = createContext();

export const storeReducer = (state, action) => {
    switch (action.type) {
        case STORE_ACTION_TYPES.SET_LAT_LONG: {
            return { ...state, latLong: action.payload };
        }
        case STORE_ACTION_TYPES.SET_COFFEE_STORES: {
            return { ...state, coffeeShops: action.payload };
        }
        default: {
            throw new Error(`Unhandled action type ${action.type}`)
        }
    }
}

const StoreProvider = ({ children }) => {
    const initialState = {
        latLong: '',
        coffeeShops: [],
    }

    const [state, dispatch] = useReducer(storeReducer, initialState);

    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    )
}

export default StoreProvider;