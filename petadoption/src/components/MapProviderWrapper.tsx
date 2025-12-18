"use client";

import React from "react";
import { APIProvider } from "@vis.gl/react-google-maps";

interface MapProviderWrapperProps {
    children: React.ReactNode;
}

export default function MapProviderWrapper({ children }: MapProviderWrapperProps) {
    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
            {children}
        </APIProvider>
    );
}
