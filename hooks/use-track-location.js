import { STORE_ACTION_TYPES, StoreContext } from "@/contexts/store-context";
import { useContext, useState } from "react";

const useTrackLocation = () => {
  const [locationErrorMessage, setLocationErrorMessage] = useState('');
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const {dispatch} = useContext(StoreContext);

  const success = (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    dispatch({
      type: STORE_ACTION_TYPES.SET_LAT_LONG,
      payload: `${lat},${lon}`,
    })
    setLocationErrorMessage('');
    setIsFindingLocation(false);
  }

  const error = () => {
    setIsFindingLocation(false);
    setLocationErrorMessage('Unable to retrieve your current location');
  }

  const handleTrackLocation = () => {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setLocationErrorMessage('Geolocation is not supported by your browser');
      setIsFindingLocation(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }

  return {
    locationErrorMessage,
    handleTrackLocation,
    isFindingLocation
  }
}

export default useTrackLocation;