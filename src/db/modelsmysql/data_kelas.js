module.exports = (sequelize, DataTypes) => {
    const dataKelas = sequelize.define(
        'data_kelas',
        {
            id:{
                type:DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nama:{
                type:DataTypes.STRING,
                allowNull:true,
            },
            nisn:{
                type:DataTypes.STRING,
                autoIncrement: true,
            },
            kelas:{
                type:DataTypes.STRING,
                allowNull:true,
            },
            tahun_ajaran:{
                type:DataTypes.STRING,
                autoIncrement: true,
            },
            input_date:{
                type:DataTypes.STRING,
                allowNull:false,
            },
            input_date:{
                type:DataTypes.STRING,
                allowNull:false,
            },
            flag_naik_kelas:{
                type:DataTypes.INTEGER,
                allowNull:true,
            },
        }
    )
}