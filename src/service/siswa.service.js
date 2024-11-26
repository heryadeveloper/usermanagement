const { dataIndukRepository, dataIndukMysqlRepository } = require("../repository");
const PDFDocument = require('pdfkit');
const path = require('path');
const moment = require('moment');

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



module.exports = {
    listSiswa,
    listKelas,
    naikKelas,
    getListKelasDet,
    getListNamaSiswa,
    listKelasX,
    getAllKelas,
    downloadPdf
}