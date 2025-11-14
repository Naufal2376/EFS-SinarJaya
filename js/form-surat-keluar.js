$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search)
  const editingId = urlParams.get("id")
  const form = $("#suratForm")
  const submitButton = $("#formSubmitButton")
  const formTitle = $("#formTitle")

  const sanitizeItem = (item) => ({
    No_Agenda: item.No_Agenda ?? "",
    Kementerian: item.Kementerian ?? item.Sifatnya ?? "",
    Nama_Perusahaan: item.Nama_Perusahaan ?? "",
    Alamat_Perusahaan: item.Alamat_Perusahaan ?? "",
    Nomor_Surat: item.Nomor_Surat ?? "",
    Tanggal_Surat: item.Tanggal_Surat ?? "",
    Hal: item.Hal ?? "",
    Penandatangan: item.Penandatangan ?? "",
    Sifat: item.Sifat ?? "",
    Tanggal_Pemusnahan: item.Tanggal_Pemusnahan ?? "",
    PDF: item.PDF ?? "",
  })

  const loadData = () => {
    const raw =
      JSON.parse(localStorage.getItem("reformaIndahSuratKeluarData")) || []
    return raw.map(sanitizeItem)
  }
  const saveData = (data) =>
    localStorage.setItem(
      "reformaIndahSuratKeluarData",
      JSON.stringify(data.map(sanitizeItem))
    )

  if (editingId) {
    formTitle.text("Edit Surat Keluar")
    submitButton
      .html('<i class="fas fa-sync-alt mr-2"></i>Update Data')
      .removeClass("bg-amber-800")
      .removeClass("bg-red-800")
      .addClass("bg-yellow-500")

    const tableData = loadData()
    const dataToEdit = tableData.find((item) => item.No_Agenda == editingId)
    if (dataToEdit) {
      $("#No_Agenda")
        .val(dataToEdit.No_Agenda)
        .prop("readonly", true)
        .addClass("bg-gray-300")
      $("#Kementerian").val(dataToEdit.Kementerian || "")
      $("#Sifat").val(dataToEdit.Sifat || "")
      $("#Nama_Perusahaan").val(dataToEdit.Nama_Perusahaan)
      $("#Alamat_Perusahaan").val(dataToEdit.Alamat_Perusahaan)
      $("#Nomor_Surat").val(dataToEdit.Nomor_Surat)
      $("#Tanggal_Surat").val(dataToEdit.Tanggal_Surat)
      $("#Hal").val(dataToEdit.Hal)
      $("#Penandatangan").val(dataToEdit.Penandatangan)
      $("#Tanggal_Pemusnahan").val(dataToEdit.Tanggal_Pemusnahan)
      if (dataToEdit.PDF) {
        $("#pdfPreview")
          .removeClass("hidden")
          .find("a")
          .attr("href", `pdf/surat-keluar/${dataToEdit.PDF}`)
          .text(dataToEdit.PDF)
      }
    }
  }

  form.on("submit", function (e) {
    e.preventDefault()
    let tableData = loadData()
    const existingPDF = editingId
      ? tableData.find((item) => item.No_Agenda == editingId)?.PDF || null
      : null

    const formData = {
      No_Agenda: $("#No_Agenda").val(),
      Kementerian: $("#Kementerian").val(),
      Nama_Perusahaan: $("#Nama_Perusahaan").val(),
      Alamat_Perusahaan: $("#Alamat_Perusahaan").val(),
      Nomor_Surat: $("#Nomor_Surat").val(),
      Tanggal_Surat: $("#Tanggal_Surat").val(),
      Hal: $("#Hal").val(),
      Penandatangan: $("#Penandatangan").val(),
      Sifat: $("#Sifat").val(),
      Tanggal_Pemusnahan: $("#Tanggal_Pemusnahan").val(),
      PDF: $("#PDF").prop("files")[0]?.name || existingPDF,
    }

    if (editingId) {
      const index = tableData.findIndex((item) => item.No_Agenda == editingId)
      tableData[index] = formData
    } else {
      if (tableData.some((item) => item.No_Agenda == formData.No_Agenda)) {
        Swal.fire("Gagal!", "No. Urut Agenda sudah digunakan.", "error")
        return
      }
      tableData.push(formData)
    }

    saveData(tableData)
    Swal.fire(
      "Berhasil!",
      `Data berhasil ${editingId ? "diperbarui" : "disimpan"}.`,
      "success"
    ).then(() => {
      window.location.href = "surat-keluar.html"
    })
  })
})