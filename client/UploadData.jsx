import Papa from "papaparse";
import axios from "axios";

export default function UploadData({ onUpload }) {

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: async (results) => {
        try {
          // ✅ Filter valid rows (avoid crashes)
          const validRows = results.data.filter(
            (row) =>
              row.title &&
              row.latitude &&
              row.longitude &&
              row.source
          );

          // ⚡ Faster upload (parallel)
          await Promise.all(
            validRows.map((row) =>
              axios.post("http://localhost:5000/add", {
                title: row.title,
                description: row.description || "",
                latitude: Number(row.latitude),
                longitude: Number(row.longitude),
                imageUrl: row.imageUrl || "",
                source: row.source,
              })
            )
          );

          alert(`CSV Uploaded! (${validRows.length} records)`);
          onUpload();

        } catch (err) {
          console.error("Upload error:", err);
          alert("Error uploading CSV");
        }
      },

      error: (err) => {
        console.error("Parse error:", err);
        alert("Invalid CSV file");
      }
    });
  };

  return (
    <div>
      <h4>Upload CSV</h4>
      <input type="file" accept=".csv" onChange={handleFile} />
    </div>
  );
}