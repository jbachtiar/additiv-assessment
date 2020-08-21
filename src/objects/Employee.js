class Employee {
  constructor(name, title, subordinate) {
    this.name = name;
    this.title = title;
    this.subordinate = subordinate;
    this.directReports = [];
    this.treeId = "";
  }
}

export default Employee;
