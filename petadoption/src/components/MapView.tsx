//Google maps component

"use client";

import React, { useState } from "react";
import { Map, Marker, InfoWindow } from "@vis.gl/react-google-maps";

interface MarkerData {
    id: string;
    lat: number;
    lng: number;
    label: string;
}

interface MapViewProps {
    markers: MarkerData[];
}

export default function MapView({ markers = [] }: MapViewProps) {
    const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);

    return (
        <div style={{ width: "100%", height: "500px" }}>
            <Map
                defaultCenter={{ lat: 44.9772995, lng: -93.2654692 }}
                defaultZoom={10}
            >
                {markers.map((marker) => (
                    <React.Fragment key={marker.id}>
                        <Marker
                            position={{ lat: marker.lat, lng: marker.lng }}
                            onMouseOver={() => setHoveredMarkerId(marker.id)}
                            onMouseOut={() => setHoveredMarkerId(null)}
                        />
                        {hoveredMarkerId === marker.id && (
                            <InfoWindow
                                position={{ lat: marker.lat, lng: marker.lng }}
                                pixelOffset={[0, -40]}
                            >
                                <div style={{ fontSize: "20px", fontWeight: "500" }}>
                                    {marker.label}
                                </div>
                            </InfoWindow>
                        )}
                    </React.Fragment>
                ))}
            </Map>
        </div>
    );
}
