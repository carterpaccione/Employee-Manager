class Employee {
    firstName: string;
    lastName: string;
    role: string;
    manager?: string;

    constructor(firstName: string, lastName: string, role: string, manager?: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.manager = manager;
    }
}

export default Employee;

