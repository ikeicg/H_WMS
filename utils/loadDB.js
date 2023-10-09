const Staff = require("../models/staff");
const Department = require("../models/department");
const mongoose = require("mongoose");

module.exports = async function () {
  await Staff.deleteMany({});
  await Department.updateMany({}, { $set: { staffId: [] } });

  const Users = [
    {
      employeeId: "23-001",
      firstname: "Thomas",
      lastname: "Nwosu",
      password: "staff1",
      departmentId: new mongoose.Types.ObjectId("652291d5edac03d28c68c276"),
      queue: [],
      role: "Front Desk",
    },
    {
      employeeId: "23-002",
      firstname: "Jennifer",
      lastname: "Ezeh",
      password: "staff2",
      departmentId: new mongoose.Types.ObjectId("65229304edac03d28c68c277"),
      queue: [],
      role: "Triage",
    },
    {
      employeeId: "23-003",
      firstname: "Titilayo",
      lastname: "Seun",
      password: "staff3",
      departmentId: new mongoose.Types.ObjectId("65229304edac03d28c68c278"),
      queue: [],
      role: "Pharmacy",
    },
    {
      employeeId: "23-004",
      firstname: "Sanusi",
      lastname: "Lamido",
      password: "staff4",
      departmentId: new mongoose.Types.ObjectId("65229304edac03d28c68c279"),
      queue: [],
      role: "Physician",
    },
    {
      employeeId: "23-005",
      firstname: "Osaro",
      lastname: "Ebinehita",
      password: "staff5",
      departmentId: new mongoose.Types.ObjectId("65229304edac03d28c68c27a"),
      queue: [],
      role: "Admin",
    },
  ];

  for (let i = 0; i < Users.length; i++) {
    const newStaffer = await new Staff(Users[i]);
    await newStaffer.save();
    await newStaffer.addMe();
  }
};
