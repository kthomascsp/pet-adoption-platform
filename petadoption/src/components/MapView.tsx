//Google maps component

"use client";

import React from "react";
import { Map, Marker } from "@vis.gl/react-google-maps";

interface MarkerData {
    id: string;
    lat: number;
    lng: number;
    label?: string;
}

interface MapViewProps {
    markers?: MarkerData[];
}

export default function MapView({ markers = [] }: MapViewProps) {
    return (
        <div style={{ width: "100%", height: "500px" }}>
            <Map
                defaultCenter={{ lat: 44.9772995, lng: -93.2654692 }} //MLPS
                defaultZoom={10}
            >
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        title={marker.label}
                    />
                ))}
            </Map>
        </div>
    );
}
