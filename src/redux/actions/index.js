import * as app from './app';
import * as dataLocal from './dataLocal';
import * as auth from './auth';
import * as category from './category';
import * as product from './product';
import * as staff from './staff';
import * as service from './service';
import * as extra from './extra';
import * as upload from './upload';
import * as appointment from './appointment';
import * as customer from './customer';
import * as invoice from './invoice';
import * as marketing from './marketing';
import * as report from './report';
import * as review from './review';
import * as hardware from './hardware';
import * as orderRetail from './orderRetail';

const actions = Object.assign({
  app,
  dataLocal,
  auth,
  category,
  product,
  staff,
  service,
  extra,
  upload,
  appointment,
  customer,
  invoice,
  marketing,
  report,
  review,
  hardware,
  orderRetail,
});

export default actions;
