using my.maintenance as my from '../db/schema';

service MaintenanceService {
    entity Technicians as projection on my.Technicians;
    entity MaintenanceOrders as projection on my.MaintenanceOrders;
}