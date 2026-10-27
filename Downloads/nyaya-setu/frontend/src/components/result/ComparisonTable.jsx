export default function ComparisonTable({ fields = [] }) {
  return <table><thead><tr><th>Field</th><th>Document 1</th><th>Document 2</th><th>Match</th></tr></thead>
    <tbody>{fields.map((field, index) => <tr key={field.name ?? index}><th>{field.name}</th><td>{field.value1}</td><td>{field.value2}</td><td>{field.matches ? "Yes" : "Review"}</td></tr>)}</tbody>
  </table>;
}
