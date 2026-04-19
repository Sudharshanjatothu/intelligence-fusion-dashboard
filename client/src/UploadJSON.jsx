import axios from "axios";

export default function UploadJSON({ onUpload }) {
  const handleFile = async (e) => {
    const file = e.target.files[0];

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      for (let item of data) {
        await axios.post("http://localhost:5000/add", {
          title: item.title,
          description: item.description,
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
          imageUrl: item.imageUrl,
          source: item.source
        });
      }

      alert("JSON Uploaded!");
      onUpload();

    } catch (err) {
      console.error(err);
      alert("Invalid JSON file");
    }
  };

  return (
    <div>
      <h4>Upload JSON</h4>
      <input type="file" accept=".json" onChange={handleFile} />
    </div>
  );
}