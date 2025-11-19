"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ScrollToTopOnApplied() {
    const searchParams = useSearchParams();
    const applied = searchParams.get("applied");

    useEffect(() => {
        if (applied === "true") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [applied]);

    return null;
}
