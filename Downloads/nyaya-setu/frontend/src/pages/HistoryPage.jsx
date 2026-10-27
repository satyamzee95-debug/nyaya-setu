import { Link } from "react-router-dom";

export default function HistoryPage() {
  return <main className="simple-page"><span className="section-kicker">YOUR WORKSPACE</span><h1>Review history</h1><p>Completed reviews will appear here. This prototype does not store submitted documents or verification results.</p><Link className="button button-primary" to="/verify">Start a new review <span aria-hidden="true">→</span></Link></main>;
}
