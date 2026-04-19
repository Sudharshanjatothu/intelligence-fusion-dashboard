import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import axios from "axios";

export default function DragDropUpload({ onUpload }) {
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

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

          alert("Drag & Drop Upload Successful!");
          onUpload();
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={{
        border: "2px dashed #888",
        padding: "20px",
        marginTop: "10px",
        textAlign: "center",
        cursor: "pointer"
      }}
    >
      <input {...getInputProps()} />
      <p>📂 Drag & Drop CSV file here</p>
    </div>
  );
}