export default function SideBySideViewer({ first, second }) {
  return <div className="upload-grid"><img className="image-preview" src={first} alt="First document" /><img className="image-preview" src={second} alt="Second document" /></div>;
}
