export default function RedFlagCard({ flag }) {
  return <article className="card"><strong>{flag?.title ?? "Potential inconsistency"}</strong><p>{flag?.description ?? "Details are not available."}</p></article>;
}
