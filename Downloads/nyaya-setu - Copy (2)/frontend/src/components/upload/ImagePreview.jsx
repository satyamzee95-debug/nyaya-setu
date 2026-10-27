export default function ImagePreview({ src, alt = "Uploaded document preview" }) {
  return src ? <img className="image-preview" src={src} alt={alt} /> : null;
}
