import React from 'react';

type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  // Optional custom placeholder while loading (e.g., low‑res src)
  placeholderSrc?: string;
};

/**
 * Wrapper around the native <img> element that enforces best‑practice attributes:
 *  - Requires an explicit alt attribute (empty string for decorative images).
 *  - Enables lazy‑loading by default.
 *  - Supports an optional placeholder for progressive loading.
 */
export default function Img({ alt = '', placeholderSrc, ...rest }: ImgProps) {
  // If a placeholder is provided, render it first and replace when the real image loads.
  const [loaded, setLoaded] = React.useState(!placeholderSrc);

  return (
    <picture>
      {placeholderSrc && !loaded && (
        <img src={placeholderSrc} alt="" aria-hidden="true" loading="lazy" />
      )}
      <img
        {...rest}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </picture>
  );
}
