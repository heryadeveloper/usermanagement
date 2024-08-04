module.exports = (sequelize, DataTypes) => {
    const kekuranganPembayaran = sequelize.define(
        'kekurangan_pembayaran_siswa',
        {
            id:{
                type:DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nama:{
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
            kode_pembayaran:{
                type: DataTypes.STRING,
                allowNull: true,
            },
            jenis_pembayaran:{
                type: DataTypes.STRING,
                allowNull: true,
            },
            kekurangan_pembayaran:{
                type:DataTypes.INTEGER,
                allowNull: false,
            },
            tanggal_terakhir_transaksi:{
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull:false,
            },
            petugas_input:{
                type: DataTypes.STRING,
                allowNull:false,
            }
        },{
            tableName:'kekurangan_pembayaran_siswa'
        }
    );
    return kekuranganPembayaran;
}