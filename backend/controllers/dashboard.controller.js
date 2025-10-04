const db = require("../models");
const { Op } = require("sequelize");
const User = db.User;
const Expense = db.Expense;

exports.getStats = async (req, res) => {
    const { role } = req.query;
    const { userId, companyId } = req.session;

    try {
        let stats = {};
        // Correct way to get the start of today as a Date object
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Fetch company to get defaultCurrency
        const company = await db.Company.findByPk(companyId);
        const defaultCurrency = company ? company.defaultCurrency : 'USD';

        switch (role) {
            case 'admin':
                stats.totalUsers = await User.count({ where: { companyId } });
                stats.totalPending = await Expense.count({ where: { companyId, status: 'Pending' } });
                const companyMonthlySum = await Expense.sum('amountInCompanyCurrency', {
                    where: { companyId, expenseDate: { [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) } }
                });
                stats.companyMonthlyTotal = companyMonthlySum?.toFixed(2) || 0;
                break;

            case 'manager':
                const employees = await User.findAll({ where: { managerId: userId } });
                const employeeIds = employees.map(e => e.id);
                // Querying against the new 'approvedById' field and using the correct date object
                const approvedTodayCount = await Expense.count({
                    where: { 
                        approvedById: userId, 
                        status: 'Approved', 
                        updatedAt: { [Op.gte]: startOfToday } 
                    }
                });
                stats.approvedToday = approvedTodayCount;

                const teamMonthlySum = await Expense.sum('amountInCompanyCurrency', {
                    where: { submittedById: { [Op.in]: employeeIds }, expenseDate: { [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) } }
                });
                stats.teamMonthlyTotal = teamMonthlySum?.toFixed(2) || 0;
                break;

            case 'employee':
                stats.total = await Expense.count({ where: { submittedById: userId } });
                stats.pending = await Expense.count({ where: { submittedById: userId, status: 'Pending' } });
                stats.approved = await Expense.count({ where: { submittedById: userId, status: 'Approved' } });
                stats.rejected = await Expense.count({ where: { submittedById: userId, status: 'Rejected' } });
                break;

            default:
                return res.status(400).send({ message: "Invalid role specified." });
        }

        stats.defaultCurrency = defaultCurrency;
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};