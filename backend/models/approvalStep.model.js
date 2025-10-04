module.exports = (sequelize, DataTypes) => {
    const ApprovalStep = sequelize.define("approvalStep", {
        approvalRuleId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        approverId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        step: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    ApprovalStep.associate = (models) => {
        ApprovalStep.belongsTo(models.ApprovalRule, { foreignKey: "approvalRuleId" });
        ApprovalStep.belongsTo(models.User, { foreignKey: "approverId", as: "approver" });
    };

    return ApprovalStep;
};