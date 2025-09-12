import "./FullAnalyticsData.css";

export default function FullAnalyticsData({ data }) {
  if (!data) return <p>No analysis data available.</p>;

  return (
    <div className="analysis-table-container">
      <h3>Structured Call Analysis</h3>
      <table className="analysis-table">
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key}>
              <th>{key.replace(/_/g, " ")}</th>
              <td>
                {typeof value === "object" && value !== null ? (
                  <div className="nested-object">
                    {Object.entries(value).map(([subKey, subValue]) => (
                      <p key={subKey}>
                        <strong>{subKey.replace(/_/g, " ")}:</strong>{" "}
                        {subValue || "N/A"}
                      </p>
                    ))}
                  </div>
                ) : (
                  value || "N/A"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

