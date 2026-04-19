import Papa from "papaparse";
import axios from "axios";

export default function UploadData({ onUpload }) {
  const handleFile = (e) => {
    const file = e.target.files[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          for (let row of results.data) {
            await axios.post("http://localhost:5000/add", {
              title: row.title,
              description: row.description,
              latitude: Number(row.latitude),
              longitude: Number(row.longitude),
              imageUrl: row.imageUrl,
              source: row.source
            });
          }

          alert("CSV Uploaded!");
          onUpload();
        } catch (err) {
          console.error(err);
        }
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