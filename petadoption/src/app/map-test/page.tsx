import React from "react";
import MapProviderWrapper from '@/components/MapProviderWrapper';
import MapView from "@/components/MapView";

export default function MapTestPage() {
    // Hardcoded examples
    const locations = [
        { id: "1", lat: 44.9874427, lng: -93.3295043, label: "Animal Humane Society, Golden Valley" },
        { id: "2", lat: 44.9385381, lng: -93.2289748, label: "The Rescue Pack" },
        { id: "3", lat: 44.89652, lng: -93.447351, label: "The Bond Between" },
    ];

    return (
        <main style={{ padding: "1rem" }}>
            <h1>Google Maps Test</h1>
            <MapProviderWrapper>
                <MapView markers={locations} />
            </MapProviderWrapper>
        </main>
    );
}
