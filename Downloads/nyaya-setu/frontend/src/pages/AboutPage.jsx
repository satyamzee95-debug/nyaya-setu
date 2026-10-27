import { Link } from "react-router-dom";

export default function AboutPage() {
  return <main className="simple-page"><span className="section-kicker">ABOUT THE PROJECT</span><h1>Technology with human judgment</h1><p>Nyaya Setu is a prototype for comparing fields in a land deed and its related property tax receipt. It is designed to make discrepancies easier to notice—not to decide what they mean.</p><p>The sample walkthrough uses fictional information only. Real verification requires a connected backend and review by an authorized professional.</p><Link className="button button-primary" to="/verify?demo=true">Explore the sample <span aria-hidden="true">→</span></Link></main>;
}
