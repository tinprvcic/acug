# ACUG

### Instalacija

- za pokretanje aplikacije potrebni su alati `node` i `yarn`
- potrebno je instalirati potrebne JavaScript pakete pokretanjem `yarn` naredbe iz naredbenog retka

### Environment varijable

- s projektom je isporučena datoteka `.env.example`. Tu datoteku potrebno je kopirati u `.env` i popuniti ju vlastitim podacima.

### Baza podataka

- za pokretanje aplikacije potrebna je baza podataka Postgres, a informacije za pristup potrebno je upisati u `.env` datoteku
- prije prvog pokretanja aplikacije, potrebno je inicijalizirati bazu podataka
  - pokrenuti naredbu `yarn init_db`
  - zatim pokrenuti naredbu `yarn populate_db`

### Pokretanje aplikacije

- nakon uspješno obavljenih prethodnih koraka, aplikaciju je moguće pokrenuti naredbom `yarn start`
