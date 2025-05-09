import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const stores = [
  { id: 1, name: "Electronic Store", lat: 5.7744, lng: -0.2133 },
  { id: 2, name: "Grocery Store", lat: 5.7750, lng: -0.2140 },
];

export default function StoreMap() {
  return (
    <LoadScript googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        center={{ lat: 5.7744, lng: -0.2133 }}
        zoom={14}
      >
        {stores.map((store) => (
          <Marker key={store.id} position={{ lat: store.lat, lng: store.lng }} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
