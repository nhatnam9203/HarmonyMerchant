## Script Use

### Create Screen

yarn new:screen [1] [2] [3]

yarn new:screen retailer RTStaffCheckIn reatiler.staff_checkin

### Create Page

yarn new:page [path] [name]

[path] : retailer/RTCustomScreen/pages
[name]: EditCustomerPage

=> yarn new:page retailer/RTCustomerScreen/pages EditCustomerPage name

eg: yarn new:page retailer/RTReportsScreen/pages ReportSalesPage retailer.report.sales

settings
yarn new:page retailer/RTSettingsScreen/pages SettingStaffPage retailer.settings.staff
yarn new:page retailer/RTSettingsScreen/pages SettingNewAttributesPage retailer.settings.attributes.new

// home pages
yarn new:page retailer/RTHomeScreen/pages HomeOrderListPage retailer.home.order.list
yarn new:page retailer/RTHomeScreen/pages HomeOrderDetailPage retailer.home.order.detail

yarn new:page retailer/RTInventoryScreen/pages InventoryAdjustQtyPage retailer.inventory.product.qty

### Create Component

yarn new:component [name]

- name : name of component

=> yarn new:component Button

### Create API

yarn new:api [path] [name]

- path : retailer / merchant / app
- name : name of api \* upercase first letter

=> yarn new:api retailer Attributes

### Create Redux

