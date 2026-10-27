const documentTypes = ["LAND_DEED", "TAX_RECEIPT", "AADHAAR", "FORM"];

export default function DocTypeSelector({ value, onChange }) {
  return <select value={value ?? ""} onChange={(event) => onChange?.(event.target.value)} aria-label="Document type">
    <option value="">Select document type</option>
    {documentTypes.map((type) => <option key={type} value={type}>{type.replaceAll("_", " ")}</option>)}
  </select>;
}
