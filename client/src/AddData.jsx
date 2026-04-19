import { useState } from "react";
import axios from "axios";

export default function AddData({ onAdd }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    latitude: "",
    longitude: "",
    imageUrl: "",
    source: "IMINT"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📂 Upload image
  const handleImage = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData);
      setForm({ ...form, imageUrl: res.data.imageUrl });
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/add", form);
      alert("Data added!");

      onAdd();

      setForm({
        title: "",
        description: "",
        latitude: "",
        longitude: "",
        imageUrl: "",
        source: "IMINT"
      });

    } catch (err) {
      console.error(err);
      alert("Error adding data");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "10px", background: "#fff" }}>
      <h3>Add Intelligence</h3>

      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} /><br />
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} /><br />
      <input name="latitude" placeholder="Latitude" value={form.latitude} onChange={handleChange} /><br />
      <input name="longitude" placeholder="Longitude" value={form.longitude} onChange={handleChange} /><br />

      {/* ✅ FILE INPUT (IMPORTANT) */}
      <input type="file" onChange={handleImage} /><br />

      <select name="source" value={form.source} onChange={handleChange}>
        <option value="IMINT">IMINT</option>
        <option value="OSINT">OSINT</option>
        <option value="HUMINT">HUMINT</option>
      </select><br />

      <button type="submit">Add</button>
    </form>
  );
}