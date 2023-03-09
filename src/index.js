import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryCard = document.querySelector('.country-info');
countryList.style.listStyle = 'none';

function onSearch(e) {
  e.preventDefault();
  const searchQuery = inputEl.value.trim();
  if (searchQuery) {
    fetchCountries(searchQuery)
      .then(countries => {
        if (countries.length > 1 && countries.length < 11) {
          countryCard.innerHTML = '';
          renderList(countries);
        } else if (countries.length === 1) {
          countryList.innerHTML = '';
          renderCard(countries);
        } else if (countries.length > 10) {
          clearInterface();
          Notiflix.Notify.success(
            'Too many matches found. Please enter a more specific name.'
          );
        }
      })
      .catch(error => {
        clearInterface();
        console.log(error.name);
      });
  } else {
    clearInterface();
  }
}

function renderList(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `<li>
          <span><img src = "${flags.svg}" width="30"/></span>
          <span>${name.official}</span>
        </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCard(countries) {
  const { flags, name, capital, population, languages } = countries[0];
  const languageList = Object.values(languages).join(', ');
  const markup = `<span><img src = "${flags.svg}" width="30"/></span>
<span style="font-size:30px;font-weight:700">${name.official}</span><p><b>Capital: </b>${capital}</p><p><b>Population: </b>${population}</p><p><b>Languages: </b>${languageList}</p>`;
  countryCard.innerHTML = markup;
}

function clearInterface() {
  countryCard.innerHTML = '';
  countryList.innerHTML = '';
}

inputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
