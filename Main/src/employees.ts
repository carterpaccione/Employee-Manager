class Employee {
    firstName: string;
    lastName: string;
    role: number;
    manager?: number | null;

    constructor(firstName: string, lastName: string, role: number, manager?: number | null) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.manager = manager;
    }
}

export default Employee;

