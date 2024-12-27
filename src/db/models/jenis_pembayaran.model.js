
module.exports = (sequelise, DataTypes) =>{
    const JenisPembayaran = sequelise.define(
        'jenis_pembayaran',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            kode_pembayaran: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            jenis_transaksi: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            kelas: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            nominal_bulan: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            nominal_total:{
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            tahun_ajaran: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        }, {
            tableName:'jenis_pembayaran'
        }
    );

    return JenisPembayaran;
}
