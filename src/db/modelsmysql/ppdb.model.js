module.exports = (sequelize, DataTypes) => {
    const ppdbSmkNu = sequelize.define(
        'ppdb_smknu',
        {
            id:{
                type:DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nama_lengkap:{
                type:DataTypes.STRING,
                allowNull: false,
            },
            tanggal_pendaftaran: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            nisn: {
                type:DataTypes.STRING,
                allowNull: false,
            },
            asal_sekolah: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            tahun_kelulusan: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            nik: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            tempat_lahir: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            tanggal_lahir: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            jenis_kelamin: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            agama: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            alamat: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            rt: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            rw: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            desa_kelurahan: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            kecamatan: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            kabupaten: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            kode_pos: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            no_wa: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            nama_ayah: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            pekerjaan_ayah: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            nama_ibu: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            pekerjaan_ibu: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            nama_wali: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            pekerjaan_wali: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            no_hp_orang_tua: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            program_jurusan_yang_diminati: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },{
            tableName:'ppdb_smknu'
        }
    );
    return ppdbSmkNu;
}
