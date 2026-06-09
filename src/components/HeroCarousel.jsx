import { useState, useEffect } from "react";

const INTERVAL = 5000;

export function HeroCarousel({ images }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = (index) => setCurrent((index + images.length) % images.length);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % images.length), INTERVAL);
    return () => clearInterval(id);
  }, [paused, images.length]);

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`Open hockey session ${i + 1}`}
          className={`carousel-slide${i === current ? " active" : ""}`}
        />
      ))}

      <button className="carousel-btn prev" onClick={() => go(current - 1)} aria-label="Previous">
        &#8249;
      </button>
      <button className="carousel-btn next" onClick={() => go(current + 1)} aria-label="Next">
        &#8250;
      </button>

      <div className="carousel-dots">
        {images.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot${i === current ? " active" : ""}`}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
