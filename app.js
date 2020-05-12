const API = 'https://acme-users-api-rev.herokuapp.com/api';
const list = document.querySelector('#list');

const state = {
  products: []
}

const render = (products) => {

  const lis = products.map(product => {
    const {
      name,
      description,
      suggestedPrice,
      offerings,
      companies,
      id
    } = product;

    const offeringsLis = offerings.map(offering => {
      return `<li>Offered By: ${companies[offerings.indexOf(offering)].name } at $${offering.price}</li>`;
    }).join('');

    return `<li>
      <h2><a href='#${id}'>${name}</a></h2>
      <p>${description}</p>
      <p>$${suggestedPrice}</p>
      <ul>
        ${offeringsLis}
      </ul>
    </li>`
  }).join('');

  list.innerHTML = lis;
}

async function fetchData() {
  const offeringsFetch = fetch(`${API}/offerings`);
  const companiesFetch = fetch(`${API}/companies`);
  const productsFetch = fetch(`${API}/products`);

  const [offeringsResponse, companiesResponse, productsResponse] = await Promise.all([offeringsFetch, companiesFetch, productsFetch]);

  const offerings = (await offeringsResponse.json())
    .map(offering => {
      const {
        companyId,
        price,
        productId
      } = offering

      return {
        companyId,
        price,
        productId
      }
    });

  const companies = (await companiesResponse.json())
    .map(company => {
      const {
        id,
        name
      } = company;

      return {
        id,
        name
      }
    });

  const products = (await productsResponse.json())
    .map(product => {
      const {
        id,
        name,
        suggestedPrice,
        description
      } = product;

      return {
        id,
        name,
        suggestedPrice,
        description
      }
    }).map(product => {
      let findOfferings = offerings.filter(offering => {
        return offering.productId === product.id;
      });

      let findCompanies = findOfferings.map(offering => {
        return companies.find(company => {
          return company.id === offering.companyId;
        })
      });

      product.offerings = findOfferings;
      product.companies = findCompanies;

      return product;
    });


  state.products = products;

  render(state.products);
}

const getProduct = () => {
  console.log(123);
  const id = window.location.hash.slice(1);

  const product = state.products.filter(product => {
    return product.id === id;
  });

  console.log(product);

  render(product);
}

window.addEventListener('hashchange', getProduct);


fetchData();