
module.exports = (sequelize, DataTypes) => {
    const laporanSpp = sequelize.define(
        'laporan_spp_siswa',
        {
            id:{
                type:DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nama_siswa:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            kelas:{
                type:DataTypes.STRING,
                allowNull: false,
            },
            nisn:{
                type: DataTypes.STRING,
                allowNull: true,
            },
            bulan_bayar:{
                type: DataTypes.STRING,
                allowNull: true,
            },
            tanggal_bayar:{
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull:false,
            },
            kode_bayar:{
                type: DataTypes.STRING,
                allowNull:false,
            },
            jenis_transaksi:{
                type: DataTypes.STRING,
                allowNull:false,
            },
            nominal_bulan:{
                type:DataTypes.INTEGER,
                allowNull: false,
            },
            created_at:{
                type:DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull:false,
            },
            updated_at:{
                type:DataTypes.DATE,
                allowNull:true
            },
            petugas_input:{
                type: DataTypes.STRING,
                allowNull:true,
            },
            tahun_bayar:{
                type: DataTypes.STRING,
                allowNull:true,
            }
        },{
            tableName:'laporan_spp_siswa'
        }
    );
    return laporanSpp;
}