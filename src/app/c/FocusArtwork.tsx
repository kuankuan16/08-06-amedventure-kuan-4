import Image from "next/image";
import styles from "./page.module.css";

export type FocusArtworkKind = "neurovascular" | "cardiovascular" | "surgical" | "intelligence";

const artworkAssets: Record<FocusArtworkKind, string> = {
  neurovascular: "/images/amed/focus-neurovascular-glass.jpg",
  cardiovascular: "/images/amed/focus-cardiovascular-glass.jpg",
  surgical: "/images/amed/focus-surgical-glass.jpg",
  intelligence: "/images/amed/focus-digital-health-glass.jpg",
};

export function FocusArtwork({ artwork }: { artwork: FocusArtworkKind }) {
  return (
    <span className={`${styles.focusArtwork} ${styles[`focusArtwork${artwork}`]}`} aria-hidden="true">
      <span><Image src={artworkAssets[artwork]} alt="" fill sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 32vw" /></span>
    </span>
  );
}
