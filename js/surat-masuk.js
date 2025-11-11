function loadTableData() {
  const savedData = localStorage.getItem("reformaIndahSuratMasukData")
  return savedData ? JSON.parse(savedData) : []
}

function saveTableData(data) {
  localStorage.setItem("reformaIndahSuratMasukData", JSON.stringify(data))
}

function formatDate(date) {
  if (!date) return "-"
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

$(document).ready(function () {
  let tableData = loadTableData()
  const table = $("#suratTable").DataTable({
    data: tableData,
    responsive: true,
    columns: [
      { data: "No_Agenda" },
      { data: "Sifatnya" },
      { data: "Nama_Perusahaan" },
      { data: "Alamat_Perusahaan" },
      { data: "Nomor_Surat" },
      { data: "Tanggal_Surat", render: (data) => formatDate(data) },
      { data: "Ditujukan" },
      { data: "Hal" },
      { data: "Penandatangan" },
      { data: "Tanggal_Pemusnahan", render: (data) => formatDate(data) },
      {
        data: "Photo",
        width: "300px",
        render: function (data) {
          return data
            ? `<a href="images/surat-masuk/${data}" target="_blank"><img src="images/surat-masuk/${data}" class="h-[200px] w-full object-contain rounded-md mx-auto hover:scale-110 transition-transform duration-300"/></a>`
            : "<span>-</span>"
        },
      },
      {
        data: null,
        render: function (data, type, row) {
          return `
            <div class="flex space-x-2 justify-center">
              <button onclick="editData('${
                row.No_Agenda
              }')" class="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"><i class="fas fa-edit"></i></button>
              <button onclick="deleteData('${
                row.No_Agenda
              }')" class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"><i class="fas fa-trash"></i></button>
              ${
                row.PDF
                  ? `<button onclick="printPDF('surat-masuk','${row.PDF}')" class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700" title="Print / Lihat PDF"><i class='fas fa-print'></i></button>`
                  : ""
              }
            </div>`
        },
      },
    ],
    language: {
    },
    dom: '<"flex flex-col md:flex-row justify-between items-center mb-4 gap-4"<"flex items-center"l>>t<"flex flex-col md:flex-row justify-between items-center mt-4 gap-4"<"flex items-center flex-wrap gap-2"B><"flex items-center gap-4"ip>>',
    buttons: [
      {
        text: '<i class="fas fa-file-export mr-2"></i>Export JSON',
        className: "bg-red-700 hover:bg-red-800 m-1",
        action: () => exportData(),
      },
      {
        text: '<i class="fas fa-file-import mr-2"></i>Import JSON',
        className: "bg-red-700 hover:bg-red-800 m-1",
        action: () => $("#jsonImportInput").click(),
      },
      {
        text: '<i class="fas fa-trash-alt mr-2"></i>Hapus Semua',
        className: "bg-red-800 hover:bg-red-900 m-1",
        action: () => clearAllData(),
      },
    ],
  })

  $("#searchPerusahaan").on("keyup", function () {
    table.column(2).search(this.value).draw()
  })

  $("#searchHal").on("keyup", function () {
    table.column(7).search(this.value).draw()
  })

  $("#jsonImportInput").on("change", function (e) {
    if (e.target.files.length > 0) {
      importData(e.target.files[0])
    }
    $(this).val("")
  })

  window.editData = function (id) {
    window.location.href = `form-surat-masuk.html?id=${id}`
  }

  window.deleteData = function (id) {
    Swal.fire({
      title: "Anda Yakin?",
      text: "Data tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
    }).then((result) => {
      if (result.isConfirmed) {
        let currentData = loadTableData()
        currentData = currentData.filter((item) => item.No_Agenda != id)
        saveTableData(currentData)
        table.clear().rows.add(currentData).draw()
        Swal.fire("Terhapus!", "Data telah dihapus.", "success")
      }
    })
  }

  window.exportData = function () {
    const dataStr = JSON.stringify(loadTableData(), null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "arsip_surat_masuk_reforma_indah.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  window.importData = function (file) {
    const reader = new FileReader()
    reader.onload = function (e) {
      try {
        const importedData = JSON.parse(e.target.result)
        if (Array.isArray(importedData)) {
          saveTableData(importedData)
          table.clear().rows.add(importedData).draw()
          Swal.fire("Berhasil!", "Data JSON berhasil diimpor.", "success")
        } else {
          throw new Error("Format JSON tidak valid.")
        }
      } catch (error) {
        Swal.fire("Gagal!", error.message, "error")
      }
    }
    reader.readAsText(file)
  }

  window.clearAllData = function () {
    Swal.fire({
      title: "Hapus Semua Data?",
      text: "Tindakan ini akan menghapus semua arsip surat masuk!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus Semua!",
    }).then((result) => {
      if (result.isConfirmed) {
        saveTableData([])
        table.clear().draw()
        Swal.fire("Berhasil!", "Semua data telah dihapus.", "success")
      }
    })
  }

  window.showFilterPopup = function () {
    Swal.fire({
      title: "Cari Nama Perusahaan",
      input: "text",
      inputLabel: "Masukkan nama perusahaan",
      inputPlaceholder: "Nama perusahaan...",
      showCancelButton: true,
      confirmButtonText: "Lanjut",
      cancelButtonText: "Batal",
      preConfirm: (perusahaan) => {
        if (!perusahaan) {
          Swal.showValidationMessage("Nama perusahaan tidak boleh kosong")
        }
        return perusahaan
      },
    }).then((result1) => {
      if (result1.isConfirmed) {
        const perusahaan = result1.value
        Swal.fire({
          title: "Cari Perihal",
          input: "text",
          inputLabel: "Masukkan perihal",
          inputPlaceholder: "Perihal...",
          showCancelButton: true,
          confirmButtonText: "Cari",
          cancelButtonText: "Batal",
          preConfirm: (perihal) => {
            if (!perihal) {
              Swal.showValidationMessage("Perihal tidak boleh kosong")
            }
            return perihal
          },
        }).then((result2) => {
          if (result2.isConfirmed) {
            const perihal = result2.value
            const table = $("#suratTable").DataTable()
            table.column(2).search(perusahaan, true, false)
            table.column(7).search(perihal, true, false)
            table.draw()
          }
        })
      }
    })
  }

  window.resetFilter = function () {
    const table = $("#suratTable").DataTable()
    table.column(2).search("")
    table.column(7).search("")
    table.draw()
  }

  window.printPDF = function (type, file) {
    if (file) {
      window.open(`pdf/${type}/${file}`, "_blank")
    }
  }
})