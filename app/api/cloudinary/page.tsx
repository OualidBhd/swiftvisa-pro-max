'use client';

import { useEffect, useState } from 'react';

export default function CloudinaryImagesPage() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch('/api/cloudinary/list');
      const data = await res.json();
      if (data.success) {
        const urls = data.resources.map((img: any) => img.secure_url);
        setImages(urls);
      }
    };
    fetchImages();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-[#1F2D5A]">Uploaded Images from Cloudinary</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((url, idx) => (
          <img key={idx} src={url} alt={`cloudinary-${idx}`} className="rounded shadow" />
        ))}
      </div>
    </main>
  );
}