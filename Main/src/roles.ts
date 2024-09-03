class Role {
    id: number;
    title: string;
    salary: number;
    department: number;

    constructor(id: number, title: string, salary: number, department: number) {
        this.id = id;
        this.title = title;
        this.salary = salary;
        this.department = department;
    }
}

export default Role;