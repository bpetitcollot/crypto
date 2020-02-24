import fetchData from './fetchData.js';

class CountWordsWidget extends HTMLElement {

  constructor() {
    super();
    this.data = null;
  }

  static get observedAttributes() {return ['data-dataset', 'data-field', 'data-filters']; }

  countWords(array){
    if (array.length === 0){
      return {};
    }
    else {
      const word = array[0];
      return {
        ...this.countWords(array.filter(w => w !== word)),
        [word]: array.filter(w => w === word).length
      }
    }
  }

  connectedCallback(){
    this.innerHTML = `
      <div class="result"></div>
    `;
  }

  attributeChangedCallback(){
    if (this.dataset.dataset && this.dataset.field !== ''){
      fetchData(this.dataset.dataset, this.dataset.field, this.dataset.filters ? this.dataset.filters.split(',') : '').then(text => {
        this.data = text;
        if (this.data){
          const html = Object.entries(this.countWords(this.data.split(' '))).sort(([a, countA], [b, countB]) => {
            return (countA < countB) ? 1 : (countA === countB ? 0 : -1);
          }).map(([char, count]) => {
            return `<tr>` +
            '<td>' + char + '</td>' +
            '<td>' + count + '</td>' +
            `</tr>`;
          }).join('');
          this.querySelector('.result').innerHTML = '<table>' + html + '</table>';
        }
      });
    } else {
      this.querySelector('.result').innerHTML = '';
    }
  }
}

customElements.define('countwords-widget', CountWordsWidget);

export default CountWordsWidget;
