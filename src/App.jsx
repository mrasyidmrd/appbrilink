import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const formatRupiahInput = (value) => {
    const angka = value.replace(/[^0-9]/g, "");
    return angka.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseRupiah = (value) => {
    return parseInt(value.replace(/\./g, "")) || 0;
  };

  const [transaksi, setTransaksi] = useState([]);
  useEffect(() => {
  fetch(		"https://script.google.com/macros/s/AKfycbwpTSCF37iMW078exbOHmZY4KQfIGcK4D7hSY1KTWFrTFh0XB-M8zws6sW1y_YL_rNT/exec")
    .then(res => res.json())
    .then(data => setTransaksi(data));
}, []);
  
  const [form, setForm] = useState({
    jenisTransaksi: "",
    keterangan: "",
    nominal: "",
    admin: "",
  });

  const kirimKeGoogleSheet = async (data) => {
    try {
      
await fetch("https://script.google.com/macros/s/AKfycbwpTSCF37iMW078exbOHmZY4KQfIGcK4D7hSY1KTWFrTFh0XB-M8zws6sW1y_YL_rNT/exec", 
		{
			method: "POST",
			mode: "no-cors",
			headers: {
			"Content-Type": "application/json",
		},
  body: JSON.stringify(data),
});

    } catch (error) {
      alert("Gagal kirim ke Google Sheet");
    }
  };

const getTimestamp = () => {
  const now = new Date();

  const tahun = now.getFullYear();
  const bulan = String(now.getMonth() + 1).padStart(2, "0");
  const hari = String(now.getDate()).padStart(2, "0");
  const jam = String(now.getHours()).padStart(2, "0");
  const menit = String(now.getMinutes()).padStart(2, "0");
  
  return `${tahun}-${bulan}-${hari} ${jam}:${menit}`;
};



  const tambahTransaksi = () => {
    if (!form.jenisTransaksi || !form.nominal || !form.admin) {
      alert("Jenis transaksi, nominal dan admin wajib diisi");
      return;
    }

    const transaksiBaru = {
      tanggal: getTimestamp(),
      jenisTransaksi: form.jenisTransaksi,
      keterangan: form.keterangan,
      nominal: parseRupiah(form.nominal),
      admin: parseRupiah(form.admin),
    };

    setTransaksi([...transaksi, transaksiBaru]);

    kirimKeGoogleSheet(transaksiBaru);


    setForm({
      jenisTransaksi: "",
      keterangan: "",
      nominal: "",
      admin: "",
    });

  };

  return (  
    <div className="container">
      <h2>Aplikasi Pencatatan AgenBRILink</h2>
	      <select
	        value={form.jenisTransaksi}
	        onChange={(e) =>
	          setForm({ ...form, jenisTransaksi: e.target.value })
	        }
	      >
	        <option value="">Pilih Jenis Transaksi</option>
	        <option>Transfer</option>
	        <option>Tarik Tunai</option>
	        <option>Setor Tunai</option>
	        <option>Pembayaran</option>
	        <option>Topup</option>
	      </select>
      <input type="text"
  placeholder="Keterangan (Opsional)"
  value={form.keterangan}
  onChange={(e) =>
    setForm({
      ...form,
      keterangan: e.target.value.toUpperCase()
    })
  }
/>
      <input
        type="text"
        placeholder="Nominal"
        value={form.nominal}
        onChange={(e) =>
          setForm({
            ...form,
            nominal: formatRupiahInput(e.target.value),
          })
        }
      />

      <select
  value={form.admin}
  onChange={(e) =>
    setForm({
      ...form,
      admin: e.target.value,
    })
  }
>
  <option value="">Pilih Admin Fee</option>
  <option value="3.000">3.000</option>
  <option value="5.000">5.000</option>
  <option value="10.000">10.000</option>
  <option value="15.000">15.000</option>
  <option value="20.000">20.000</option>
  <option value="25.000">25.000</option>
</select>


      <button onClick={tambahTransaksi}>
        Simpan Transaksi
      </button>

   <div className="table-wrapper">
<div className="riwayat">
  <h3>Riwayat Transaksi</h3>

  <table>
    <thead>
  <tr>
    <th>No</th>
    <th>Tanggal</th>
    <th>Jenis</th>
    <th>Keterangan</th>
    <th>Nominal</th>
    <th>Admin</th>
  </tr>
</thead>

    <tbody>
  {[...transaksi].reverse().map((t, i) => (

    <tr key={i}>
      <td>{i + 1}</td> {/* Nomor otomatis */}
      <td>
		{new Date(item.tanggal).toLocaleString("id-ID", {
			day: "2-digit",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		  })}  
	  </td>
      <td>{t.jenisTransaksi}</td>
      <td>{t.keterangan || "-"}</td>
      <td>Rp {t.nominal.toLocaleString("id-ID")}</td>
      <td>Rp {t.admin.toLocaleString("id-ID")}</td>
    </tr>
  ))}
</tbody>

  </table>
</div>
   </div>
   

    </div>
  );
}
