using { managed, cuid, Currency, Country, Language } from '@sap/cds/common';
namespace my.common;

entity CommonDemo : managed, cuid {
  name       : String(100);
  country    : Country;
  currency   : Currency;
  language   : Language;
}
