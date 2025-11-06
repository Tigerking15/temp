import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Lottie from "lottie-react";
import clinicAnim from "./assets/lottie/nearbyclinics.json";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const libraries = ["places"];

export default function NearbyClinics() {
  const [userLocation, setUserLocation] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 19.076, lng: 72.8777 }); // Default: Mumbai
  const [searchQuery, setSearchQuery] = useState("");
  const [map, setMap] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [userAddress, setUserAddress] = useState("your area");

  // ✅ Automatically fetch user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(loc);
        setMapCenter(loc);
      },
      (err) => {
        console.warn("Geolocation error:", err);
        const defaultLoc = { lat: 19.076, lng: 72.8777 };
        setUserLocation(defaultLoc);
        setMapCenter(defaultLoc);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  // ✅ Once both map & location are ready → load clinics + reverse geocode
  useEffect(() => {
    if (map && userLocation) {
      searchNearbyClinics(userLocation);
      reverseGeocode(userLocation);
    }
  }, [map, userLocation]);

  // ✅ Fallback to Mumbai if location unavailable
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!userLocation && map) searchNearbyClinics(mapCenter);
    }, 5000);
    return () => clearTimeout(timer);
  }, [map]);

  const onMapLoad = (mapInstance) => setMap(mapInstance);

  // ✅ Search for nearby Ayurvedic clinics (with photos)
  const searchNearbyClinics = (location) => {
    if (!map || !window.google) return;

    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: location,
      radius: 5000,
      type: ["health"],
      keyword: "ayurvedic clinic",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const detailedPromises = results.slice(0, 6).map((place) => {
          return new Promise((resolve) => {
            service.getDetails(
              {
                placeId: place.place_id,
                fields: [
                  "name",
                  "formatted_address",
                  "geometry",
                  "rating",
                  "photos",
                  "vicinity",
                ],
              },
              (details, detailStatus) => {
                console.log(details, place)
                if (
                  detailStatus ===
                    window.google.maps.places.PlacesServiceStatus.OK &&
                  details
                ) {
                  resolve(details);
                } else {
                  resolve(place);
                }
              }
            );
          });
        });

        Promise.all(detailedPromises).then((detailedResults) => {
          setClinics(detailedResults);
        });
      } else {
        console.error("Error fetching nearby clinics:", status);
      }
    });
  };

  // ✅ Manual search
  const handleSearch = () => {
    if (!searchQuery || !map) return;

    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      query: `${searchQuery} ayurvedic clinic`,
      fields: ["name", "geometry", "formatted_address", "rating", "photos"],
    };

    service.textSearch(request, (results, status) => {
      console.log(results[0].photos[0].getUrl())
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const newCenter = results[0].geometry.location;
        setMapCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
        setClinics(results.slice(0, 6));
      }
    });
  };

  // ✅ WhatsApp booking
  const handleBookConsultation = (clinic) => {
    window.open(
      `https://api.whatsapp.com/send?phone=+91XXXXXXXXXX&text=Hi, I’d like to book an Ayurvedic consultation at ${encodeURIComponent(
        clinic.name
      )}`,
      "_blank"
    );
  };

  // ✅ Near Me button
  const returnToUserLocation = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      searchNearbyClinics(userLocation);
      reverseGeocode(userLocation);
    }
  };

  // ✅ Directions
  const handleGetDirections = (clinic) => {
    if (!userLocation) {
      alert("Please allow location access to get directions.");
      return;
    }
    const destination = `${clinic.geometry.location.lat()},${clinic.geometry.location.lng()}`;
    const origin = `${userLocation.lat},${userLocation.lng}`;
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`,
      "_blank"
    );
  };

  // ✅ Reverse Geocode — get locality / station name
  const reverseGeocode = (loc) => {
    if (!window.google || !loc) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: loc }, (results, status) => {
      if (status === "OK" && results[0]) {
        const comps = results[0].address_components;
        const station = comps.find((c) =>
          c.types.includes("train_station")
        );
        const poi = comps.find((c) => c.types.includes("point_of_interest"));
        const sublocality = comps.find((c) =>
          c.types.includes("sublocality_level_1")
        );
        const locality = comps.find((c) => c.types.includes("locality"));

        let name =
          station?.long_name ||
          poi?.long_name ||
          sublocality?.long_name ||
          locality?.long_name ||
          results[0].formatted_address.split(",")[0];

        setUserAddress(name);
      } else {
        console.warn("Geocode failed:", status);
        setUserAddress("your area");
      }
    });
  };

  return (
    <div className="font-sans text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 via-primary/5 to-primary/20 min-h-screen flex flex-col justify-center items-center text-center overflow-hidden pt-24">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/clinic.mp4" type="video/mp4" />
        </video>

        <div className="z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-white">
            Find Ayurvedic Clinics Near You
          </h1>
          <p className="text-lg md:text-2xl mb-6 text-white">
            Discover authentic Ayush wellness centers near{" "}
            <span className="font-bold text-green-200">
              {userAddress}
            </span>
          </p>
        </div>

        <div className="w-72 md:w-96 mb-8 z-10">
          <Lottie animationData={clinicAnim} loop={true} />
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 bg-white flex flex-col items-center">
        <div className="flex w-full md:w-1/2 items-center space-x-2">
          <input
            type="text"
            placeholder="Search location..."
            className="flex-grow border border-primary/30 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            Search
          </button>
          <button
            onClick={returnToUserLocation}
            className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold hover:bg-secondary/90 transition"
          >
            Near Me
          </button>
        </div>
      </section>

      {/* Map Section */}
      <section className="px-6 md:px-20 py-6">
        <LoadScript
          googleMapsApiKey="AIzaSyDnwGpH-RDFsXFrHtRuYk_0MHw8cBTK5H8"
          libraries={libraries}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={13}
            onLoad={onMapLoad}
          >
            {userLocation && (
              <Marker
                position={userLocation}
                title="You are here"
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                }}
              />
            )}

            {clinics.map((clinic, idx) => (
              <Marker
                key={idx}
                position={{
                  lat: clinic.geometry.location.lat(),
                  lng: clinic.geometry.location.lng(),
                }}
                title={clinic.name}
                onClick={() => setActiveMarker(idx)}
              >
                {activeMarker === idx && (
                  <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                    <div className="text-sm">
                      <h3 className="font-semibold text-primary">{clinic.name}</h3>
                      <p className="text-gray-600">
                        {clinic.vicinity || clinic.formatted_address}
                      </p>
                      <p className="text-yellow-500">⭐ {clinic.rating || "N/A"}</p>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            ))}
          </GoogleMap>
        </LoadScript>
      </section>

      {/* Clinic Cards */}
      <section className="py-12 px-6 md:px-20 bg-primary/5">
        <h2 className="text-3xl font-bold mb-8 text-center text-primary">
          Nearest Clinics
        </h2>

        {clinics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clinics.map((clinic, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl shadow-lg flex flex-col items-center text-center hover:shadow-2xl transition duration-300"
              >
                {clinic.photos && clinic.photos.length > 0 ? (
                  <img
                    // src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${clinic.photos[0].photo_reference}&key=AIzaSyDnwGpH-RDFsXFrHtRuYk_0MHw8cBTK5H8`}
                    src={clinic.photos[0].getUrl()}
                    alt={clinic.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <img
                    src="/images/ayurveda-default.jpg"
                    alt="Ayurvedic clinic"
                    className="w-full h-40 object-cover rounded-lg mb-4 opacity-90"
                  />
                )}

                <h3 className="text-xl font-semibold text-primary mb-2">
                  {clinic.name}
                </h3>
                <p className="text-gray-600 mb-1">
                  {clinic.formatted_address || clinic.vicinity}
                </p>
                <p className="text-yellow-500 mb-2">⭐ {clinic.rating || "N/A"}</p>

                <button
                  onClick={() => handleBookConsultation(clinic)}
                  className="mt-2 px-6 py-2 bg-primary text-white rounded-full font-semibold shadow-lg hover:bg-primary/90 transition duration-300"
                >
                  Book Consultation
                </button>

                <button
                  onClick={() => handleGetDirections(clinic)}
                  className="mt-2 px-6 py-2 bg-green-600 text-white rounded-full font-semibold shadow-lg hover:bg-green-700 transition duration-300"
                >
                  Get Directions
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            {userLocation ? "Searching nearby clinics..." : "Fetching your location..."}
          </p>
        )}
      </section>
    </div>
  );
}
