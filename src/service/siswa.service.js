const { dataIndukRepository, dataIndukMysqlRepository, kekuranganPembayaranMysqlRepository } = require("../repository");
const PDFDocument = require('pdfkit');
const path = require('path');
const moment = require('moment');
const ExcelJs = require('exceljs');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

async function listSiswa(req){
    const {rombel_saat_ini} = req.query;
    try {
        // const listSiswaService = await dataIndukRepository.getListDataSiswa(rombel_saat_ini);
        const listSiswaService = await dataIndukMysqlRepository.getListDataSiswa(rombel_saat_ini);
        return listSiswaService;
    } catch (error) {
        console.error('Error in listSiswa: ', error);
        throw error;
    }
}

async function listKelas(){
    try {
        const listKelasAll = await dataIndukMysqlRepository.listRombel();
        return listKelasAll;
    } catch (error) {
        console.error('Error in service list kelas: ', error);
        throw error;
    }
}

async function naikKelas(req){
    const {tahun_ajaran, rombel_saat_ini} = req.body;
    try {
        await dataIndukMysqlRepository.naikKelas(tahun_ajaran, rombel_saat_ini);
        return {
            responseData: 'Success Update Data Kenaikan kelas'
        }
    } catch (error) {
        console.error('Error when update naik kelas: ', error);
        throw new Error("Error when update naik kelas");
    }
}

async function getListKelasDet(req){
    const {tahun_ajaran} = req.query;
    try {
        const data = await dataIndukMysqlRepository.getListKelasDet(tahun_ajaran);
        return data;
    } catch (error) {
        console.error('Error when get data kelas: ', error);
        throw new Error("Error when get data kelas");
    }
}

async function getListNamaSiswa(req){
    const {tahun_masuk, kelas} = req.query;
    try {
        console.log(tahun_masuk, kelas);
        const data = await dataIndukMysqlRepository.getNamaSiswa(tahun_masuk, kelas);
        return data;
    } catch (error) {
        console.error('Error when get nama: ', error);
        throw new Error('Error when get nama siswa');
    }
}

async function listKelasX(req) {
    const {tahun_ajaran} = req.query;
    try {
        const data = await dataIndukMysqlRepository.getListAllKelasX(tahun_ajaran);
        return data;
    } catch (error) {
        console.error('Error get list kelas : ', error);
        throw error;
    }
}

async function getAllKelas(req) {
    try {
        const {tahun_ajaran} = req.query;
        const data = await dataIndukMysqlRepository.getListAll(tahun_ajaran);
        return data;
    } catch (error) {
        console.error('Error get data kelas : ', error);
        throw error;
    }
}

async function downloadPdf(req, res){
    const {nisn} = req.query;

    const data = {  
        ketua: 'Yuli Sumantri, S.Kom',
        nip: '85.201409.010',
    };

    const dataPpdb = await dataIndukMysqlRepository.getDataPpdb(nisn);
    const databaru = dataPpdb?? {};
    const formattedDate = moment(databaru.tanggal_pendaftaran).format('DD-MM-YYYY');
    console.log('data ppdb: ', formattedDate);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Set Header Response untuk download file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=surat_pendaftaran.pdf');

    // Pipe dokumen ke response
    doc.pipe(res);

    // Tambahkan Logo
    doc.image(path.join(__dirname, '../assets/logosmk.png'), 50, 50, { width: 80 });
    // Judul Utama
    doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('PANITIA PENERIMAAN PESERTA DIDIK BARU (PPDB)', { align: 'center' })
        .text('TAHUN PELAJARAN 2025/2026', { align: 'center' })
        .text('SMK NU TULIS', { align: 'center' })
        .text('KABUPATEN BATANG', { align: 'center' })
        .moveDown(0.5);

    // Sub Judul
    doc
        .fontSize(10)
        .font('Helvetica')
        .text(
            'Jl. Raya Tulis-Batang Gg. Melati No.02 Gondangan Tulis Batang 51261\n' +
                'Telp.(0285)3972786 email : smknu_tulis@yahoo.co.id',
            { align: 'center' }
        )
        .moveDown(1);

    // Garis horizontal
    doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .stroke()
        .moveDown(0.5);

    // Judul Surat
    doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('SURAT BUKTI PENDAFTARAN', { align: 'center' })
        .text('PENERIMAAN PESERTA DIDIK BARU (PPDB)', { align: 'center' })
        .text('TAHUN PELAJARAN 2025/2026', { align: 'center' })
        .text('SMK NU TULIS', { align: 'center' })
        .moveDown(1);

    generateAlignedPDF(doc, databaru);

    // Pesan tambahan
    doc
    .moveUp(-2)
    .text(
        'Nama tersebut diatas telah terdaftar sebagai calon peserta didik baru SMK NU Tulis\n' +
            'Kabupaten Batang Tahun Pelajaran 2025/2026.\n',
        50, // Posisi x (margin kiri baru)
        doc.y, // Posisi y (lanjut dari baris sebelumnya)
        { align: 'left', width: 500 } // Atur lebar teks
    )
    .moveDown(0.5)
    .text(
        'Silahkan melakukan registrasi ulang dengan membawa dokumen prasyarat\n' +
            'pendaftaran ke SMK NU Tulis Kabupaten Batang.',
        50, // Posisi x (margin kiri baru)
        doc.y, // Posisi y (lanjut dari baris sebelumnya)
        { align: 'left', width: 500 } // Atur lebar teks
    )


    // Tanggal dan Ketua
    doc
        .moveDown(3)
        .fontSize(10)
        .font('Helvetica')
        .text(`Tulis, ${formattedDate}`, { align: 'right' })
        .text('Ketua Panitia PPDB,', { align: 'right' })
        .moveDown(5)
        .text(data.ketua, { align: 'right' })
        .text(`NIPY. ${data.nip}`, { align: 'right' });

    // Tambahkan Stempel
    doc
        .moveDown(2)
        .image(path.join(__dirname, '../assets/stempel.png'), 400, doc.y - 100, { width: 120 });

    // Catatan
    doc
        .moveDown(4)
        .fontSize(9)
        .text('Catatan :', { align: 'left' })
        .text('Surat ini harap dibawa saat tes/registrasi ulang.', { align: 'left' });

    // Akhiri dokumen
    doc.end();

}


const generateAlignedPDF = (doc, databaru) => {
    const leftMargin = 50; // Margin kiri untuk label
    const labelWidth = 200; // Lebar kolom label
    const colonWidth = labelWidth + 10; // Posisi tanda ":" setelah label
    const valueStart = colonWidth + 10; // Posisi kolom nilai setelah tanda ":"

    // Fungsi untuk menambahkan baris data
    const addRow = (label, value) => {
        doc.font('Helvetica')
        const currentY = doc.y; // Simpan posisi vertikal (y) saat ini
        doc.text(label, leftMargin, currentY); // Tulis label di kolom pertama
        doc.text(':', colonWidth, currentY); // Tulis tanda ":" di kolom kedua
        doc.text(value, valueStart, currentY); // Tulis nilai di kolom ketiga
        
    };

    // Tambahkan setiap data siswa
    addRow('Nama Siswa', databaru.nama_lengkap);
    addRow('NISN/NIS', databaru.nisn);
    addRow('Alamat', databaru.alamat);
    addRow('E-mail', databaru.email);
    addRow('Asal Sekolah', databaru.asal_sekolah);
    addRow('No. Pendaftaran', databaru.id);
    addRow('Prodi Pilihan', databaru.program_jurusan_yang_diminati);
};

async function downloadFormPpdb(req, res) {
    try {
        const {nisn} = req.query;
        // const dataPpdb = await dataIndukMysqlRepository.getDataPpdb(nisn);
        const dataPpdb = await dataIndukMysqlRepository.getDataFormPpdb(nisn);
        const databaru = dataPpdb?.responseData ?? [];
        const formattedDate = moment(databaru.tanggal_pendaftaran).format('DD-MM-YYYY');

        console.log('data : ', databaru);

        // Menentukan posisi bingkai pas foto
        const x = 45; // Koordinat x (posisi horizontal)
        const yy = 450; // Koordinat y (posisi vertikal)

        // Ukuran bingkai pas foto 4x6 dalam poin
        const width = 113.4; // Lebar 4 cm
        const height = 170.1; // Tinggi 6 cm

        const doc = new PDFDocument({ size: 'A4', margin: 50});

        // Set Header Response untuk download file
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=surat_pendaftaran.pdf');

        // Pipe dokumen ke response
        doc.pipe(res);

            // Membuat Bingkai
        // Membuat Bingkai (Border Luar)
    const margin = 15; // Jarak bingkai dari tepi halaman
    doc
        .rect(margin, margin, doc.page.width - margin * 2, doc.page.height - margin * 2)
        .lineWidth(1.5) // Ketebalan garis
        .strokeColor('#000000') // Warna hitam
        .stroke(); // Gambar garis bingkai

    // Menambahkan Header
    doc.image(path.join(__dirname, '../assets/logosmk.png'), 50, 30, { width: 70 });

    //judul utama
    doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('PANITIA PENERIMAAN PESERTA DIDIK BARU (PPDB)', { align: 'center'})
        .text('TAHUN PELAJARAN 2025/2026', { align: 'center' })
        .text('SMK NU TULIS', { align: 'center' })
        .text('KABUPATEN BATANG', { align: 'center' });
        

    doc
        .moveDown(0.5)
        .fontSize(13)
        .font('Helvetica-Bold')
        .text('FORMULIR PENDAFTARAN', { align: 'center' });

    // Membuat Kotak Informasi Prodi & Nomor Pendaftaran
    doc
        .moveDown(2)
        .fontSize(11)
        .font('Helvetica')
        .text('Prodi Yang Diminati', 50, 160)
        .text(': ' + databaru[0].program_jurusan_yang_diminati, 200, 160)
        .text('No. Pendaftaran', 50, 180)
        .text(': ppdb.2025-2026-' + databaru[0].id, 200, 180);

    doc
        .rect(45, 150, 515, 50) // Kotak di sekitar Prodi & Nomor Pendaftaran
        .lineWidth(0.5)
        .strokeColor('#000000')
        .stroke();

    // Membuat Judul Bagian "Data Identitas Peserta Didik"
    doc
        .rect(45, 210, 515, 20) // Kotak dengan background hijau muda
        .fillAndStroke('#d9ead3', '#000000')
        .fillColor('#000000')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('DATA IDENTITAS PESERTA DIDIK', 50, 215);

    // Menambahkan Data Identitas Peserta Didik
    const identitas = [
        { key: 'Nama Siswa', value: databaru[0].nama_lengkap },
        { key: 'NISN/NIS', value: databaru[0].nisn },
        { key: 'NIK', value: databaru[0].nik },
        { key: 'Tempat, Tanggal Lahir', value: databaru[0].ttl },
        { key: 'Jenis Kelamin', value: databaru[0].jenis },
        { key: 'Agama', value: databaru[0].agama },
        { key: 'Alamat', value: databaru[0].alamat },
        { key: 'No Handphone/WA', value: databaru[0].no_wa },
    ];

    let y = 240; // Posisi awal untuk data identitas
    identitas.forEach((item) => {
        doc
            .fontSize(11)
            .font('Helvetica')
            .text(item.key, 50, y)
            .text(':', 200, y)
            .text(item.value, 210, y);
        y += 20; // Jarak antar baris
    });

    doc
    .rect(45,y, 515, 20) // Kotak dengan background hijau muda
    .fillAndStroke('#d9ead3', '#000000')
    .fillColor('#000000')
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('DATA ORANG TUA/WALI', 50, y +5);

    const identitasOrangTua = [
        { key: 'Nama Ayah', value: databaru[0].nama_ayah },
        { key: 'Pekerjaan Ayah', value: databaru[0].pekerjaan_ayah },
        { key: 'Nama Ibu', value: databaru[0].nama_ibu },
        { key: 'Pekerjaan Ibu', value: databaru[0].pekerjaan_ibu },
        { key: 'Nama Wali', value: databaru[0].nama_wali },
        { key: 'Pekerjaan Wali', value: databaru[0].pekerjaan_wali },
        { key: 'No.Handphone/Wa', value: databaru[0].no_hp_orang_tua},
    ];

     // Posisi awal untuk data identitas
    identitasOrangTua.forEach((item) => {
        doc
            .fontSize(11)
            .font('Helvetica')
            .text(item.key, 50, y +25)
            .text(':', 200, y +25)
            .text(item.value, 210,  y +25);
        y += 20; // Jarak antar baris
    });

    // Membuat bingkai pas foto
    doc
        .rect(x, y +25, width, height) // Membuat bingkai di posisi (x, y) dengan ukuran 4x6
        .lineWidth(1) // Ketebalan garis bingkai
        .strokeColor('#000000') // Warna bingkai (hitam)
        .stroke();

    // Menambahkan label (opsional)
    doc
        .fontSize(10)
        .text('Pas Foto 4x6', x, y + height + 5, { align: 'center', width });

    const xText = 50; // Koordinat x teks tanda tangan
    const yText = y + 25; // Koordinat y teks tanda tangan

    doc
        .fontSize(10)
        .font('Helvetica')
        .text('Tulis ' +formattedDate, xText + 350, yText)
        .text('Calon Peserta Didik', xText + 350, yText + 20)
        .text(databaru[0].nama_lengkap, xText + 350, yText + 120, {underline: true});

    doc.end();
    } catch (error) {
        console.error('Failed Download Form Ppdb');
        throw error;
    }
}

async function getDataSiswaPPDB() {
    try {
        const dataSiswaPPDB = await dataIndukMysqlRepository.getDataSiswaPPDB();
        return dataSiswaPPDB;
    } catch (error) {
        console.error('Error in service get Data Siswa PPDB');
        throw error;
    }
}

async function generateExcel(res) {
    const datas = [
        {
            namaAyah: "Sugianto",
            pekerjaanAyah: "Guru",
            namaIbu: "Sumilah",
            pekerjaanIbu: "Guru",
            namaWali: "Sugianto",
            pekerjaanWali: "Guru",
            noHP: "08976526251",
            jurusan: "PENGEMBANGAN PERANGKAT LUNAK",
            highlight: "yellow", // warna baris
            },
            {
            namaAyah: "Sunardi",
            pekerjaanAyah: "-",
            namaIbu: "Siti Rofikoh",
            pekerjaanIbu: "Pedagang",
            namaWali: "Siti Rofikoh",
            pekerjaanWali: "Pedagang",
            noHP: "085669603673",
            jurusan: "TEKNIK KETENAGALISTRIKAN",
            highlight: "red", // warna baris
            },
        ];
    const dataSiswaPPDB = await dataIndukMysqlRepository.getDataSiswaPPDBForGenerateExcel();
    try {
        // Buat UUID unik
        const uniqueId = uuidv4();

        // Tentukan nama file dengan UUID
        const filename = `Generate_ppdb_${uniqueId}.xlsx`;
        const workbook = new ExcelJs.Workbook();
        const worksheet = workbook.addWorksheet('Data PPDB');
    
        // Set kolom width untuk tampilan rapi
        // worksheet.columns = [
        //     { width: 5 }, // Kolom kosong untuk padding
        //     { width: 30 },
        //     { width: 50 },
        //     { width: 5 }, // Kolom kosong untuk padding
        // ];
        
         // Membuat header
        // const logoPath = path.join(__dirname, '../assets/logosmk.png');
        // const logoImage = workbook.addImage({
        //     filename: logoPath,
        //     extension: 'png',
        // });

        // worksheet.addImage(logoImage, {
        //     tl: { col: 1, row: 1 }, // Top-left posisi (kolom 1, baris 1)
        //     ext: { width: 80, height: 80 }, // Ukuran gambar
        // });

        // worksheet.mergeCells('B2:D2');
        // worksheet.getCell('B2').value = 'PANITIA PENERIMAAN PESERTA DIDIK BARU (PPDB)';
        // worksheet.getCell('B2').font = { bold: true, size: 14 };
        // worksheet.getCell('B2').alignment = { vertical: 'middle', horizontal: 'center' };

        // worksheet.mergeCells('B3:D3');
        // worksheet.getCell('B3').value = 'TAHUN PELAJARAN 2025/2026';
        // worksheet.getCell('B3').font = { bold: true, size: 14 };
        // worksheet.getCell('B3').alignment = { vertical: 'middle', horizontal: 'center' };

        // worksheet.mergeCells('B4:D4');
        // worksheet.getCell('B4').value = 'SMK NU TULIS';
        // worksheet.getCell('B4').font = { bold: true, size: 14 };
        // worksheet.getCell('B4').alignment = { vertical: 'middle', horizontal: 'center' };

        // worksheet.mergeCells('B5:D5');
        // worksheet.getCell('B5').value = 'KABUPATEN BATANG';
        // worksheet.getCell('B5').font = { bold: true, size: 14 };
        // worksheet.getCell('B5').alignment = { vertical: 'middle', horizontal: 'center' };

        // worksheet.mergeCells('B6:D6');
        // worksheet.getCell('B6').value =
        //     'Jl. Raya Tulis-Batang Gg. Melati No.02 Gondangan Tulis Batang 51261';
        // worksheet.getCell('B6').font = { size: 10 };
        // worksheet.getCell('B6').alignment = { vertical: 'middle', horizontal: 'center' };

        // worksheet.mergeCells('B7:D7');
        // worksheet.getCell('B7').value = 'Telp.(0285)3972786 email : smknu-tulis@smknu-tulis.sch.id';
        // worksheet.getCell('B7').font = { size: 10 };
        // worksheet.getCell('B7').alignment = { vertical: 'middle', horizontal: 'center' };

        // // Membuat Border Bingkai
        // worksheet.getCell('B9').value = 'DATA IDENTITAS PESERTA DIDIK';
        // worksheet.getCell('B9').font = { bold: true, size: 12 };
        // worksheet.getCell('B9').fill = {
        //     type: 'pattern',
        //     pattern: 'solid',
        //     fgColor: { argb: 'FFD9EAD3' }, // Warna hijau muda
        // };
        // worksheet.getCell('B9').alignment = { vertical: 'middle', horizontal: 'center' };

        // worksheet.mergeCells('B9:D9');
        // worksheet.getRow(9).border = {
        //     top: { style: 'thin' },
        //     left: { style: 'thin' },
        //     bottom: { style: 'thin' },
        //     right: { style: 'thin' },
        // };

        // // Menambahkan Data Peserta
        // worksheet.getCell('B11').value = 'Prodi Yang Diminati';
        // worksheet.getCell('C11').value = ': TEKNIK KETENAGALISTRIKAN (TK)';
        // worksheet.getCell('B12').value = 'No. Pendaftaran';
        // worksheet.getCell('C12').value = ': ppdb.2024-2025-015';

        // // Membuat border di sekitar seluruh halaman
        // worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
        //     row.eachCell({ includeEmpty: true }, (cell, colIndex) => {
        //         if (rowIndex >= 1 && rowIndex <= 15 && colIndex >= 2 && colIndex <= 4) {
        //             cell.border = {
        //                 top: { style: 'thin' },
        //                 left: { style: 'thin' },
        //                 bottom: { style: 'thin' },
        //                 right: { style: 'thin' },
        //             };
        //         }
        //     });
        // });

         // Tambahkan header
        worksheet.columns = [
            { header: "No", key: "id", width: 3 },
            { header: "Nama Lengkap", key: "nama_lengkap", width: 20 },
            { header: "Nisn", key: "nisn", width: 10 },
            { header: "Asal Sekolah", key: "asal_sekolah", width: 20 },
            { header: "Tahun Kelulusan", key: "tahun_kelulusan", width: 5 },
            { header: "NIK", key: "nik", width: 20 },
            { header: "Tempat Lahir", key: "tempat_lahir", width: 20 },
            { header: "Tanggal Lahir", key: "tanggal_lahir", width: 20 },
            { header: "Alamat", key: "alamat", width: 60 },
            { header: "RT", key: "rt", width: 4},
            { header: "RW", key: "rw", width: 4 },
            { header: "Desa Kelurahan", key: "desa_kelurahan", width: 60 },
            { header: "Kecamatan", key: "kecamatan", width: 60 },
            { header: "Kabupaten", key: "kabupaten", width: 60 },
            { header: "Kode Pos", key: "kode_pos", width: 10 },
            { header: "Email", key: "email", width: 20 },
            { header: "No Wa", key: "no_wa", width: 20 },
            { header: "Nama Ayah", key: "nama_ayah", width: 20 },
            { header: "Pekerjaan Ayah", key: "pekerjaan_ayah", width: 20 },
            { header: "Nama Ibu", key: "nama_ibu", width: 20 },
            { header: "Pekerjaan Ibu", key: "pekerjaan_ibu", width: 20 },
            { header: "Nama Wali", key: "nama_wali", width: 20 },
            { header: "Pekerjaan Wali", key: "pekerjaan_wali", width: 20 },
            { header: "No Hp Orang Tua", key: "no_hp_orang_tua", width: 20 },
            { header: "Program Jurusan Yang Diminati", key: "program_jurusan_yang_diminati", width: 60 },
        ];

        dataSiswaPPDB.forEach((item) => {
            const row = worksheet.addRow(item);
            row.eachCell((cell) => {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFFFF"}
                };

                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });
        });

         // Mengirim file sebagai response
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Cannot generate excel');
        throw error;
    }
}

async function getKekuranganPembayaranSiswa(req) {
    try {
        const {nisn, tahun_ajaran} = req.query;
        const dataSiswaPPDB = await kekuranganPembayaranMysqlRepository.getDataKekuranganPembayaran(nisn, tahun_ajaran);
        return dataSiswaPPDB;
    } catch (error) {
        console.error('Error in service get Data Siswa PPDB');
        throw error;
    }
}


module.exports = {
    listSiswa,
    listKelas,
    naikKelas,
    getListKelasDet,
    getListNamaSiswa,
    listKelasX,
    getAllKelas,
    downloadPdf,
    downloadFormPpdb,
    getDataSiswaPPDB,
    generateExcel,
    getKekuranganPembayaranSiswa
}