module.exports = (sequelise, DataTypes) =>{
    const uploadDoc = sequelise.define(
        'upload_doc',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nama_file: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            path: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
            nama: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            jenis: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            tahun: {
                type: DataTypes.STRING,
                allowNull: true,
            }
        }, {
            tableName:'upload_doc'
        }
    );

    return uploadDoc;
}
