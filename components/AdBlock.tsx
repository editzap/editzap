"use client";

import { useEffect } from "react";

export default function AdBlock() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", margin: "20px 0" }}
      data-ad-client="ca-pub-4445312802335744"
      data-ad-slot="1737948061"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}