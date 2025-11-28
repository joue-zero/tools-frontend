export default function StatusBadge({ status }) {
    const styles = {
        going: "bg-green-100 text-green-800 border-green-200",
        maybe: "bg-yellow-100 text-yellow-800 border-yellow-200",
        not_going: "bg-red-100 text-red-800 border-red-200",
        pending: "bg-gray-100 text-gray-800 border-gray-200"
    };

    const labels = {
        going: "Going",
        maybe: "Maybe",
        not_going: "Not Going",
        pending: "Pending"
    };

    const currentStatus = status || "pending";
    const style = styles[currentStatus] || styles.pending;
    const label = labels[currentStatus] || labels.pending;

    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${style}`}>
            {label}
        </span>
    );
}
