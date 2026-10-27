export default function Toast({ message, role = "status" }) {
  return message ? <div className="toast" role={role}>{message}</div> : null;
}
