// using { my.bookshop as my } from '../db/schema';
// service AdminService  {
//   entity Books as projection on my.Books;
//   entity Authors as projection on my.Authors;
//   entity Categories as projection on my.Categories;
// }

using { my.bookshop as my } from '../db/schema';
using { my.common as common } from '../db/common';

service AdminService {
  entity Books as projection on my.Books;
  entity Authors as projection on my.Authors;
  entity Categories as projection on my.Categories;
  entity CommonDemo as projection on common.CommonDemo;
}
