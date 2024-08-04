module.exports = (sequelize, DataTypes) => {
    const dataKeuanganSekolahKelas = sequelize.define(
        'data_keuangan_sekolah_kelas',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        kelas: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        kode_pembayaran: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        jenis_pembayaran: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        target_total_pemasukan : {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        uang_masuk: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        kekurangan_pemasukan: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        uang_keluar:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        created_date:{
            type: DataTypes.DATE,
            allowNull: false,
        },
        updated_date:{
            type: DataTypes.DATE,
            allowNull: false,
        }
    },{
        tableName: 'data_keuangan_sekolah_kelas'
    }
    );
    return dataKeuanganSekolahKelas;
}