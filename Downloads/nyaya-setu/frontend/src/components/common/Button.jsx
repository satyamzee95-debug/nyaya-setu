export default function Button({ children, ...props }) {
  return <button className="button" type="button" {...props}>{children}</button>;
}
