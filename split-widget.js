import fetchData from './fetchData.js';

class SplitWidget extends HTMLElement {

  constructor() {
    super();
    this.data = null;
  }

  static get observedAttributes() {return ['data-dataset', 'data-field', 'data-filters', 'data-letters-per-line']; }

  connectedCallback(){
    this.innerHTML = `
      <input class="lettersPerLine" type="number" min="1" placeholder="Nombre de lettres par ligne" style="width: 20em;">
      <div class="result"></div>
    `;
    this.querySelector('.lettersPerLine').addEventListener('input', e => {
      this.dataset.lettersPerLine = e.target.value;
    });
  }

  attributeChangedCallback(){
    if (this.dataset.dataset && this.dataset.field !== ''){
      fetchData(this.dataset.dataset, this.dataset.field, this.dataset.filters ? this.dataset.filters.split(',') : '').then(text => {
        this.data = text;
        if (this.data){
          const html = this.data.split('').reduce((carry, char) => {
            if (carry.length === 0 || carry[carry.length - 1].length === parseInt(this.dataset.lettersPerLine)){
              carry.push([]);
            }
            carry[carry.length - 1].push(char);
            return carry;
          }, []).map(line => {
            return `<tr>` +
            line.map(char => ('<td>' + char + '</td>')).join('') +
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

customElements.define('split-widget', SplitWidget);

export default SplitWidget;
