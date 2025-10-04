module.exports = (sequelize, DataTypes) => {
    const ApprovalRule = sequelize.define("approvalRule", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        companyId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        minAmount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0
        }
    });

    ApprovalRule.associate = (models) => {
        ApprovalRule.hasMany(models.ApprovalStep, { as: "steps", foreignKey: "approvalRuleId" });
    };

    return ApprovalRule;
};