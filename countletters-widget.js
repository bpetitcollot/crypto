import fetchData from './fetchData.js';

class CountLettersWidget extends HTMLElement {

  constructor() {
    super();
    this.data = null;
  }

  static get observedAttributes() {return ['data-dataset', 'data-field', 'data-filters']; }

  countLetters(array){
    if (array.length === 0){
      return {};
    }
    else {
      const char = array[0];
      return {
        ...this.countLetters(array.filter(c => c !== char)),
        [char]: array.filter(c => c === char).length
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
          const html = Object.entries(this.countLetters(this.data.split(''))).sort(([a, countA], [b, countB]) => {
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

customElements.define('countletters-widget', CountLettersWidget);

export default CountLettersWidget;
