export const BASE_URL = {
  prod: 'https://run.mocky.io/',
  uat: 'https://run.mocky.io/',
  dev: 'http://192.168.0.120:8092/',
  subharjitBhai: 'http://192.168.6.254:8188/',
};

const API_VERSION = {
  api: 'generic_wms/',
};

export const PATH = {
  // If you want to point UAT/DEV/PROD Env, just alter below URL variable
  URL: BASE_URL.subharjitBhai + API_VERSION.api,
}

export const Services = {
  //login
  login: 'api/login',

  //Inbound 
  purchaseOrders: 'purchase_orders',
  receiptOrders: 'receipt_orders',
  putawayOrders: 'putaway_orders',

  //Outbound
  salesOrders: 'sales_orders',
  pickingOrders: 'picking_orders',
  deliveryOrders: 'delivery_orders',

  scanLocation: 'scan_location',
  validateProduct: 'validate_product_v2',
  scanProduct: 'scan_productv2'
};
