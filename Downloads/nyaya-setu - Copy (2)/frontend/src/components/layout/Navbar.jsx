import { Link } from "react-router-dom";

export default function Navbar() {
  return <nav className="navbar" aria-label="Main navigation"><Link to="/">Nyaya Setu</Link><Link to="/verify">Verify</Link><Link to="/history">History</Link><Link to="/about">About</Link></nav>;
}
