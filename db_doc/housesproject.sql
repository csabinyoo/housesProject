CREATE DATABASE housesProject
	CHARACTER SET utf8mb4
	COLLATE utf8mb4_hungarian_ci;

CREATE TABLE housesProject.houses (
  ID INT(11) NOT NULL AUTO_INCREMENT,
  saleID INT(11) DEFAULT NULL,
  typeID INT(11) DEFAULT NULL,
  Settlement VARCHAR(255) DEFAULT NULL,
  countyID INT(11) DEFAULT NULL,
  Rooms INT(11) DEFAULT NULL,
  parcelNumber VARCHAR(255) DEFAULT NULL,
  Area INT(11) DEFAULT NULL,
  Price INT(11) DEFAULT NULL,
  PRIMARY KEY (ID)
)
ENGINE = INNODB;

CREATE TABLE housesProject.types (
  ID INT(11) NOT NULL AUTO_INCREMENT,
  Name VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (ID)
)
ENGINE = INNODB;

CREATE TABLE housesProject.sales (
  ID INT(11) NOT NULL AUTO_INCREMENT,
  Name VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (ID)
)
ENGINE = INNODB;
CREATE TABLE housesProject.counties (
  ID INT(11) NOT NULL AUTO_INCREMENT,
  Name VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (ID)
)
ENGINE = INNODB;

insert types
  (id, Name)
  values
  (1, 'Lakás'), (2, 'Családi ház'), (3, 'Telek'), (4, 'Iroda'), (5, 'Garázs'), (6, 'Vendéglátás'), (7, 'Mezõgazdasági')

insert sales
  (id, Name)
  values
  (1, 'Eladó'), (2, 'Kiadó')

delete from sales;

insert counties
  (id, Name)
  values
  (1, 'Jász-Nagykun-Szolnok vármegye'), (2, 'Pest vármegye'), (3, 'Somogy vármegye'), (4, 'Szabolcs-Szatmár-Bereg vármegye'), (5, 'Nógrád vármegye')

delete from counties;

insert houses
  (ID, saleID, typeID, Settlement, countyID, Rooms, parcelNumber, Area, Price)
  values
  (1, 1, 1, 'Szászberek', 1, 8, '11-13421-2142', 685, 135000000),
  (2, 2, 7, 'Budapest', 2, 12, '17-42147-4124', 320, 78000000),
  (3, 2, 4, 'Kaposvár', 3, 9, '57-24141-2162', 752, 180000000),
  (4, 1, 5, 'Nyíregyháza', 4, 2, '42-42142-2487', 130, 35050000),
  (5, 1, 6, 'Salgótarján', 5, 4, '95-57441-0135', 187, 42500000)

delete from houses;

select hs.ID, ss.Name Type, ts.Name Category, Settlement, cs.Name, hs.Rooms, hs.parcelNumber, hs.Area, hs.Price from houses hs
inner join counties cs on hs.countyID = cs.id
inner join types ts on hs.typeID = ts.id
inner join sales ss on hs.saleID = ss.id
order by hs.ID;