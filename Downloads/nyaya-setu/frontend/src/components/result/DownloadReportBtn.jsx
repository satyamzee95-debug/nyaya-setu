export default function DownloadReportBtn({ onClick, disabled = false }) {
  return <button className="button" type="button" onClick={onClick} disabled={disabled}>Download report</button>;
}
