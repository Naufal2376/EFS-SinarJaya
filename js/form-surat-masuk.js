$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search)
  const editingId = urlParams.get("id")
  const form = $("#suratForm")
  const submitButton = $("#formSubmitButton")
  const formTitle = $("#formTitle")

  const loadData = () =>
    JSON.parse(localStorage.getItem("reformaIndahSuratMasukData")) || []
  const saveData = (data) =>
    localStorage.setItem("reformaIndahSuratMasukData", JSON.stringify(data))

  if (editingId) {
    formTitle.text("Edit Surat Masuk")
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
      $("#Sifatnya").val(dataToEdit.Sifatnya)
      $("#Nama_Perusahaan").val(dataToEdit.Nama_Perusahaan)
      $("#Alamat_Perusahaan").val(dataToEdit.Alamat_Perusahaan)
      $("#Nomor_Surat").val(dataToEdit.Nomor_Surat)
      $("#Tanggal_Surat").val(dataToEdit.Tanggal_Surat)
      $("#Ditujukan").val(dataToEdit.Ditujukan)
      $("#Hal").val(dataToEdit.Hal)
      $("#Penandatangan").val(dataToEdit.Penandatangan)
      $("#Tanggal_Pemusnahan").val(dataToEdit.Tanggal_Pemusnahan)
      if (dataToEdit.PDF) {
        $("#pdfPreview")
          .removeClass("hidden")
          .find("a")
          .attr("href", `pdf/surat-masuk/${dataToEdit.PDF}`)
          .text(dataToEdit.PDF)
      }
      if (dataToEdit.Photo) {
        $("#imagePreview")
          .removeClass("hidden")
          .find("img")
          .attr("src", `images/surat-masuk/${dataToEdit.Photo}`)
      }
    }
  }

  form.on("submit", function (e) {
    e.preventDefault()
    let tableData = loadData()
    const existingPhoto = editingId
      ? tableData.find((item) => item.No_Agenda == editingId)?.Photo || null
      : null
    const existingPDF = editingId
      ? tableData.find((item) => item.No_Agenda == editingId)?.PDF || null
      : null

    const formData = {
      No_Agenda: $("#No_Agenda").val(),
      Sifatnya: $("#Sifatnya").val(),
      Nama_Perusahaan: $("#Nama_Perusahaan").val(),
      Alamat_Perusahaan: $("#Alamat_Perusahaan").val(),
      Nomor_Surat: $("#Nomor_Surat").val(),
      Tanggal_Surat: $("#Tanggal_Surat").val(),
      Ditujukan: $("#Ditujukan").val(),
      Hal: $("#Hal").val(),
      Penandatangan: $("#Penandatangan").val(),
      Tanggal_Pemusnahan: $("#Tanggal_Pemusnahan").val(),
      Photo: $("#Photo").prop("files")[0]?.name || existingPhoto,
      PDF: $("#PDF").prop("files")[0]?.name || existingPDF,
    }

    if (editingId) {
      const index = tableData.findIndex((item) => item.No_Agenda == editingId)
      tableData[index] = formData
    } else {
      if (tableData.some((item) => item.No_Agenda == formData.No_Agenda)) {
        Swal.fire("Gagal!", "No. Agenda sudah digunakan.", "error")
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
      window.location.href = "surat-masuk.html"
    })
  })
})