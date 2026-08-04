using { Currency, managed, sap, cuid } from '@sap/cds/common';
namespace my.bookshop;

entity Books : managed {
  key ID : Integer;
  title  : localized String(111);
  descr  : localized String(1111);
  stock  : Integer;
  price  : Decimal(9,2);
  currency : Currency;
  category : Association to Categories;
  author : Association to Authors;
}

entity Authors : managed {
  key ID : Integer;
  name   : String(111);
}

entity Categories : managed {
  key ID : Integer;
  name   : String(100);
}