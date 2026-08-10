using { Currency, cuid, managed } from '@sap/cds/common';

namespace my.kbeauty;

entity Brands : managed, cuid {
  name     : String(100);
  country  : String(50);
  foundedYear : Integer;
  ceoName : String(100);
  website : String(255);
  email : String(100);
  status : String(20);
  products : Association to many Products on products.brand = $self;
}

entity Categories : managed, cuid {
  name     : String(100);
  description : String(255);
  targetGender : String(20);
  productType : String(50);
  status : String(20);
  priority : Integer;
  remark : String(255);
  products : Association to many Products on products.category = $self;
}

entity Products : managed {
key ID : String(10);
  name      : String(111);
  price     : Decimal(9,2);
  stock     : Integer;
  description : String(255);
  manufacture : String(100);
  expiryMonth : Integer;
  status : String(20);
  brand     : Association to Brands;
  category  : Association to Categories;
}
