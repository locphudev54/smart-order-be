"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialProvider = exports.OrderStatus = exports.TableStatus = exports.DishStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["Waiter"] = "Waiter";
    Role["Chef"] = "Chef";
    Role["Manager"] = "Manager";
})(Role || (exports.Role = Role = {}));
var DishStatus;
(function (DishStatus) {
    DishStatus["Available"] = "Available";
    DishStatus["Unavailable"] = "Unavailable";
})(DishStatus || (exports.DishStatus = DishStatus = {}));
var TableStatus;
(function (TableStatus) {
    TableStatus["Available"] = "Available";
    TableStatus["Hidden"] = "Hidden";
    TableStatus["Occupied"] = "Occupied";
})(TableStatus || (exports.TableStatus = TableStatus = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Pending"] = "Pending";
    OrderStatus["Confirmed"] = "Confirmed";
    OrderStatus["Cooked"] = "Cooked";
    OrderStatus["Served"] = "Served";
    OrderStatus["Paid"] = "Paid";
    OrderStatus["Canceled"] = "Canceled";
    OrderStatus["Rejected"] = "Rejected";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var SocialProvider;
(function (SocialProvider) {
    SocialProvider["Google"] = "google";
})(SocialProvider || (exports.SocialProvider = SocialProvider = {}));
//# sourceMappingURL=enum.js.map