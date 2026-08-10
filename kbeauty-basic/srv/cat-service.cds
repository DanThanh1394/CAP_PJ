using my.kbeauty as service from '../db/schema';

@(path: '/ThanhTD68')
service CatalogService {
  entity Products   as projection on service.Products;
  entity Brands     as projection on service.Brands;
  entity Categories as projection on service.Categories;
}
