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
          let lettersCounts = this.countLetters(this.data.split(''));
          const alphabet = 'AZERTYUIOPMLKJHGFDSQWXCVBN'.split('');
          for (let i in alphabet){
            if (!this.data.includes(alphabet[i])){
              lettersCounts[alphabet[i]] = 0;
            }
          }
          const html = Object.entries(lettersCounts).sort(([a, countA], [b, countB]) => {
            return (countA < countB) ? 1 : (countA === countB ? 0 : -1);
          }).map(([char, count]) => {
            return `<tr>` +
            '<td>' + char + '</td>' +
            '<td>' + count + '</td>' +
            '<td>' + Math.round(100 * (count / this.data.length), 2) + '%</td>' +
            `</tr>`;
          }).join('') +
          '<tr><td></td><td>' + this.data.length + '</td><td>100%</td></tr>';
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
