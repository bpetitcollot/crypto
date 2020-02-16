export default async function fetchData(dataset, field, filters = []){
  return fetch(dataset + '.json').then(res => res.json().then(json => {
    let data = field.split('.').reduce((carry, f) => carry[f], json);
    if (filters.includes('nospace') || filters.includes('letters')){
      data = data.replace(/\s/g, '');
    }
    if (filters.includes('nopunctuation') || filters.includes('letters')){
      data = data.replace(/,/g, '');
      data = data.replace(/\./g, '');
      data = data.replace(/;/g, '');
      data = data.replace(/:/g, '');
      data = data.replace(/'/g, '');
      data = data.replace(/-/g, '');
    }

    return data;
  }));
};
