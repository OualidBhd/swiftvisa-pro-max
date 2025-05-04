'use client';
import { useEffect } from "react";

export default function AnalyticsTracker() {
  useEffect(() => {
    console.log("Vercel Analytics check: page loaded");
  }, []);

  return null;
}