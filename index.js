const allTheCities = require('all-the-cities');
const _ = require('lodash');
const jsonToMarkdown = require('json-to-markdown');
const countriesByISO = require('i18n-iso-countries');

const englishNames = countriesByISO.getNames('en');
const citiesByCountry = _.groupBy(allTheCities, 'country');
const countries = Object.keys(citiesByCountry);
const largestCities = _.mapValues(citiesByCountry, cities => _.maxBy(cities, 'population'));
const secondLargestCities = _.mapValues(
  citiesByCountry,
  (cities, country) => _.maxBy(cities, city => largestCities[country].name !== city.name && city.population),
);

const result = countries.map(country => ({
  country: englishNames[country],
  'largest city name': largestCities[country].name,
  'largest city population': largestCities[country].population,
  'second largest city name': secondLargestCities[country].name,
  'second largest city population': secondLargestCities[country].population,
  'ratio': largestCities[country].population / secondLargestCities[country].population,
}));

const filteredResult = result.filter(item => item.ratio !== Infinity && item.ratio !== 1);

const orderedResult = _.orderBy(filteredResult, item => -item.ratio);

const prettyResult = orderedResult.map(item => ({
  ...item,
  ratio: item.ratio.toFixed(3),
}));

console.log(jsonToMarkdown(prettyResult, Object.keys(prettyResult[0])));
