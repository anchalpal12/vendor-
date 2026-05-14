export const initialVendors = [
  {
    id: "V001",
    companyName: "Acme Corp",
    registrationNumber: "REG12345",
    industry: "Manufacturing",
    address: "123 Factory Lane, Industrial Park",
    contactName: "John Doe",
    email: "john@acmecorp.com",
    phone: "555-0100",
    designation: "Sales Manager",
    status: "Active",
    rating: 4.5,
    onTimeDelivery: 95,
    invoiceAccuracy: 98,
    responseTime: 2, // hours
    submittedDate: "2023-10-01",
  },
  {
    id: "V002",
    companyName: "TechSupplies Inc",
    registrationNumber: "REG98765",
    industry: "IT Hardware",
    address: "456 Silicon Valley",
    contactName: "Jane Smith",
    email: "jane@techsupplies.com",
    phone: "555-0200",
    designation: "Account Executive",
    status: "Active",
    rating: 4.8,
    onTimeDelivery: 99,
    invoiceAccuracy: 100,
    responseTime: 1,
    submittedDate: "2023-11-15",
  },
  {
    id: "V003",
    companyName: "Global Logistics",
    registrationNumber: "REG55555",
    industry: "Transportation",
    address: "789 Port Road",
    contactName: "Mike Johnson",
    email: "mike@globallogistics.com",
    phone: "555-0300",
    designation: "Logistics Coordinator",
    status: "Pending",
    rating: 0,
    onTimeDelivery: 0,
    invoiceAccuracy: 0,
    responseTime: 0,
    submittedDate: "2024-05-10",
  },
  {
    id: "V004",
    companyName: "Office Essentials",
    registrationNumber: "REG11111",
    industry: "Stationery",
    address: "101 Market Street",
    contactName: "Sarah Connor",
    email: "sarah@officeessentials.com",
    phone: "555-0400",
    designation: "Owner",
    status: "Inactive",
    rating: 3.2,
    onTimeDelivery: 80,
    invoiceAccuracy: 90,
    responseTime: 24,
    submittedDate: "2022-01-20",
  },
  {
    id: "V005",
    companyName: "Shady Goods LLC",
    registrationNumber: "REG00000",
    industry: "Unknown",
    address: "999 Back Alley",
    contactName: "Tom Riddle",
    email: "tom@shadygoods.com",
    phone: "555-0500",
    designation: "CEO",
    status: "Blacklisted",
    rating: 1.0,
    onTimeDelivery: 40,
    invoiceAccuracy: 50,
    responseTime: 72,
    submittedDate: "2021-06-15",
  }
];

export const initialProducts = [
  { id: "P001", vendorId: "V001", name: "Steel Widget", sku: "WID-001", category: "Hardware", price: 10.50, description: "High-grade steel widget" },
  { id: "P002", vendorId: "V001", name: "Iron Cog", sku: "COG-001", category: "Hardware", price: 15.00, description: "Durable iron cog" },
  { id: "P003", vendorId: "V002", name: "Laptop Pro", sku: "LAP-001", category: "Electronics", price: 1200.00, description: "15-inch professional laptop" },
  { id: "P004", vendorId: "V002", name: "Wireless Mouse", sku: "MOU-001", category: "Electronics", price: 25.00, description: "Ergonomic wireless mouse" },
  { id: "P005", vendorId: "V004", name: "A4 Paper Ream", sku: "PAP-001", category: "Stationery", price: 5.00, description: "500 sheets A4 printer paper" },
  { id: "P006", vendorId: "V004", name: "Blue Pens (Box)", sku: "PEN-001", category: "Stationery", price: 8.00, description: "Box of 50 blue ballpoint pens" },
  { id: "P007", vendorId: "V001", name: "Copper Wire", sku: "WIR-001", category: "Hardware", price: 45.00, description: "100m copper wire coil" },
  { id: "P008", vendorId: "V002", name: "USB-C Hub", sku: "HUB-001", category: "Electronics", price: 35.00, description: "7-in-1 USB-C Hub" },
];

export const initialPOs = [
  { id: "PO-1001", vendorId: "V001", date: "2024-05-01", deliveryDate: "2024-05-15", status: "Fulfilled", total: 1050.00, paymentTerms: "Net 30" },
  { id: "PO-1002", vendorId: "V002", date: "2024-05-05", deliveryDate: "2024-05-20", status: "Accepted", total: 2450.00, paymentTerms: "Net 15" },
  { id: "PO-1003", vendorId: "V004", date: "2024-05-10", deliveryDate: "2024-05-12", status: "Pending", total: 130.00, paymentTerms: "Due on Receipt" },
  { id: "PO-1004", vendorId: "V001", date: "2024-05-12", deliveryDate: "2024-05-30", status: "Rejected", total: 5000.00, paymentTerms: "Net 60" },
  { id: "PO-1005", vendorId: "V002", date: "2024-05-13", deliveryDate: "2024-06-01", status: "Pending", total: 350.00, paymentTerms: "Net 30" },
  { id: "PO-1006", vendorId: "V004", date: "2024-05-14", deliveryDate: "2024-05-18", status: "Accepted", total: 80.00, paymentTerms: "Due on Receipt" },
];

export const initialInvoices = [
  { id: "INV-2001", poId: "PO-1001", vendorId: "V001", date: "2024-05-16", amount: 1050.00, status: "Approved" },
  { id: "INV-2002", poId: "PO-1002", vendorId: "V002", date: "2024-05-21", amount: 2450.00, status: "Submitted" },
  { id: "INV-2003", poId: "PO-1004", vendorId: "V001", date: "2024-05-15", amount: 5000.00, status: "Rejected", remarks: "PO was rejected" },
  { id: "INV-2004", poId: "PO-1001", vendorId: "V001", date: "2024-04-10", amount: 500.00, status: "Approved" }, // Older invoice for payment tracking
  { id: "INV-2005", poId: "PO-1006", vendorId: "V004", date: "2024-05-19", amount: 80.00, status: "Draft" },
];

export const initialPayments = [
  { id: "PAY-3001", invoiceId: "INV-2001", vendorId: "V001", amount: 1050.00, dueDate: "2024-06-15", releaseDate: null, status: "Pending" },
  { id: "PAY-3002", invoiceId: "INV-2004", vendorId: "V001", amount: 500.00, dueDate: "2024-05-10", releaseDate: "2024-05-09", status: "Released" },
  { id: "PAY-3003", invoiceId: "INV-2001", vendorId: "V001", amount: 100.00, dueDate: "2024-01-01", releaseDate: null, status: "Overdue" }, // Dummy overdue
];

export const initialShipments = [
  { id: "SHP-4001", poId: "PO-1001", vendorId: "V001", trackingNumber: "TRK123456789", courier: "FedEx", dispatchDate: "2024-05-10", eta: "2024-05-14", status: "Delivered" },
  { id: "SHP-4002", poId: "PO-1002", vendorId: "V002", trackingNumber: "TRK987654321", courier: "UPS", dispatchDate: "2024-05-15", eta: "2024-05-19", status: "In Transit" },
  { id: "SHP-4003", poId: "PO-1006", vendorId: "V004", trackingNumber: "TRK555555555", courier: "DHL", dispatchDate: "2024-05-15", eta: "2024-05-17", status: "In Transit" },
];
