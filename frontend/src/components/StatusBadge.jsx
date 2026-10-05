const styles = {
  draft: "bg-status-draft/15 text-status-draft",
  sent: "bg-status-sent/15 text-status-sent",
  paid: "bg-status-paid/15 text-status-paid",
  overdue: "bg-status-overdue/15 text-status-overdue",
  active: "bg-teal/15 text-teal",
  completed: "bg-status-paid/15 text-status-paid",
  archived: "bg-status-draft/15 text-status-draft",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status] ?? "bg-navy/10 text-navy"}`}
    >
      {status}
    </span>
  );
}
