const db = require('../config/db.config');

// Create Salary
const createSalary = async (salary) => {
  const sql = `
    INSERT INTO salaries 
    (user_id, month, year, salary, working_days, absent_days, late_days, half_days, basic, hra, conveyance_allowance, medical_allowance, other_allowance, total_earnings, net_payable, epf, esi, professional_tax, total_deduction)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    salary.user_id, salary.month, salary.year, salary.salary, salary.working_days,
    salary.absent_days, salary.late_days, salary.half_days, salary.basic, salary.hra,
    salary.conveyance_allowance, salary.medical_allowance, salary.other_allowance,
    salary.total_earnings, salary.net_payable, salary.epf, salary.esi,
    salary.professional_tax, salary.total_deduction
  ];

  const [result] = await db.query(sql, values);
  return result;
};

// Update Salary
const updateSalary = async (salary_id, salary) => {
  const sql = `
    UPDATE salaries SET 
    salary=?, working_days=?, absent_days=?, late_days=?, half_days=?, basic=?, hra=?, conveyance_allowance=?, medical_allowance=?, other_allowance=?, total_earnings=?, net_payable=?, epf=?, esi=?, professional_tax=?, total_deduction=?
    WHERE salary_id=?
  `;
  const values = [
    salary.salary, salary.working_days,
    salary.absent_days, salary.late_days, salary.half_days, salary.basic, salary.hra,
    salary.conveyance_allowance, salary.medical_allowance, salary.other_allowance,
    salary.total_earnings, salary.net_payable, salary.epf, salary.esi,
    salary.professional_tax, salary.total_deduction, salary_id
  ];

  const [result] = await db.query(sql, values);
  return result;
};


const listSalaries = async () => {
  const sql = `
    SELECT 
      s.*, 
      u.user_id AS u_user_id, u.name, u.phone_number, u.email, u.address, u.userPhoto, u.status, 
      u.employee_type, u.created_at, u.updated_at, u.emp_id, u.emp_name, u.designation, 
      u.department, u.date_of_joining, u.uan, u.pf_number, u.esi_number, u.bank, 
      u.acc_number, u.ifsc
    FROM 
      salaries s
    INNER JOIN 
      users u ON s.user_id = u.user_id
  `;

  const [rows] = await db.query(sql);

  const salaries = rows.map(row => {
    const {
      salary_id, user_id, month, year, salary, working_days, absent_days, late_days,
      half_days, basic, hra, conveyance_allowance, medical_allowance, other_allowance,
      total_earnings, net_payable, epf, esi, professional_tax, total_deduction,

      u_user_id, name, phone_number, email, address, userPhoto, status, employee_type,
      created_at, updated_at, emp_id, emp_name, designation, department,
      date_of_joining, uan, pf_number, esi_number, bank, acc_number, ifsc
    } = row;

    return {
      salary_id,
      user_id,
      month,
      year,
      salary,
      working_days,
      absent_days,
      late_days,
      half_days,
      basic,
      hra,
      conveyance_allowance,
      medical_allowance,
      other_allowance,
      total_earnings,
      net_payable,
      epf,
      esi,
      professional_tax,
      total_deduction,
      employee: {
        user_id: u_user_id,
        name,
        phone_number,
        email,
        address,
        userPhoto,
        status,
        employee_type,
        created_at,
        updated_at,
        emp_id,
        emp_name,
        designation,
        department,
        date_of_joining,
        uan,
        pf_number,
        esi_number,
        bank,
        acc_number,
        ifsc
      }
    };
  });

  return salaries;
};


const createSalarySlip = async (slip) => {
  const sql = `
    INSERT INTO salary_slips 
    (user_id, month, excel_file, created_at, updated_at)
    VALUES (?, ?, ?, NOW(), NOW())
  `;

  const values = [
    slip.user_id,
    slip.month,
    slip.excel_file
  ];

  const [result] = await db.query(sql, values);
  return result;
};


const getSalarySlipsByUserAndMonth = async (user_id, month) => {
  const sql = 'SELECT * FROM salary_slips WHERE user_id = ? AND month = ?';
  const [rows] = await db.query(sql, [user_id, month]);
  return rows;
};

const getSalaryMonthsByUser = async (user_id) => {
  const sql = `
    SELECT DISTINCT month 
    FROM salary_slips 
    WHERE user_id = ?
    ORDER BY month ASC
  `;
  const [rows] = await db.query(sql, [user_id]);
  return rows;
};


module.exports = {
  createSalary,
  updateSalary,
  listSalaries,
  createSalarySlip,
  getSalarySlipsByUserAndMonth,
  getSalaryMonthsByUser
};
