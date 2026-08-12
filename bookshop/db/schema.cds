using { Currency, managed, cuid } from '@sap/cds/common';
namespace my.bookshop;

entity Books : managed, cuid {
  title     : localized String(111);
  descr     : localized String(1111);
  stock     : Integer;
  price     : Decimal(9,2);
  currency  : Currency;
  category  : Association to Categories;
  authors   : Association to Authors;
}

entity Authors : managed, cuid {
  name   : String(111);
  books  : Composition of Books on books.authors = $self;
}

entity Categories : managed, cuid {
  name   : String(100);
  books  : Association to Books;
}