// Run this script with: node setup_approver.js
// This script sets a manager for an employee, creates an approval rule, and an approval step.

const db = require('./models');

async function setupApprover() {
  try {
    // 1. Find a company
    const company = await db.Company.findOne();
    if (!company) throw new Error('No company found.');

    // 2. Find a manager user in the company
    let manager = await db.User.findOne({ where: { companyId: company.id, role: 'Manager' } });
    if (!manager) {
      // If no manager exists, promote the first employee to manager
      manager = await db.User.findOne({ where: { companyId: company.id } });
      if (!manager) throw new Error('No user found to set as manager.');
      await manager.update({ role: 'Manager' });
    }

    // 3. Find an employee in the company (not the manager)
    let employee = await db.User.findOne({ where: { companyId: company.id, id: { [db.Sequelize.Op.ne]: manager.id } } });
    if (!employee) {
      // If no other user, create a new employee
      employee = await db.User.create({
        email: 'employee@example.com',
        password: 'password', // Set a secure password in production
        name: 'Employee',
        role: 'Employee',
        companyId: company.id,
        managerId: manager.id
      });
    } else {
      // Set the manager for the employee
      await employee.update({ managerId: manager.id });
    }

    // 4. Create an approval rule for the company
    let rule = await db.ApprovalRule.findOne({ where: { companyId: company.id } });
    if (!rule) {
      rule = await db.ApprovalRule.create({
        name: 'Default Rule',
        companyId: company.id,
        minAmount: 0
      });
    }

    // 5. Create an approval step for the rule
    let step = await db.ApprovalStep.findOne({ where: { approvalRuleId: rule.id, step: 1 } });
    if (!step) {
      await db.ApprovalStep.create({
        approvalRuleId: rule.id,
        approverId: manager.id,
        step: 1
      });
    }

    console.log('Setup complete! You can now create expenses.');
    process.exit(0);
  } catch (err) {
    console.error('Setup failed:', err);
    process.exit(1);
  }
}

// Ensure DB is ready
if (db.sequelize) {
  db.sequelize.sync().then(setupApprover);
} else {
  setupApprover();
}
