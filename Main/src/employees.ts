class Employee {
    id: number;
    first_name: string;
    last_name: string;
    role_id: number;
    manager_id?: number | null;

    constructor(id: number, first_name: string, last_name: string, role_id: number, manager_id?: number | null) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.role_id = role_id;
        this.manager_id = manager_id;
    }
}

export default Employee;

