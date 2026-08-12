namespace my.maintenance;

entity Technicians {
    key ID : String(10);
    Name : String(100);
    Skill : String(50); // Ví dụ: 'Mechanical', 'Electrical'
    WorkCenter : String(20);
    Available : String(3); // 'YES' or 'NO'
    AssignedOperations : Integer;
}

entity MaintenanceOrders {
    key OrderID : String(10);
    Equipment : String(10);
    Description : String(250);
    Plant : String(10);
    Type : String(20);
    Priority : String(20);
    Status : String(20);
    Planner : String(50);
    Scheduled : String(50);
        // Khai báo Association trỏ sang entity Technicians
    technician      : Association to Technicians;
        // Lưu skill yêu cầu của order để đối chiếu khi gán
    TechnicianSkill : String(50);
}