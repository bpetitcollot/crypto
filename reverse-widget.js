import fetchData from './fetchData.js';

class ReverseWidget extends HTMLElement {

  constructor() {
    super();
    this.data = null;
  }

  static get observedAttributes() {return ['data-dataset', 'data-field', 'data-filters', 'data-letters-per-line']; }

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
          const chars = this.data.split('');
          const length = chars.length;
          let html = '';
          for (let i in chars){
            html += `
              <span style="display: inline-block;">
                <table><tr><td>${i}</td></tr><tr><td>${chars[i]}</td></tr><tr><td>${chars[length - 1 - i]}</td></tr></table>
              </span>
            `;
          }
          this.querySelector('.result').innerHTML = html;
        }
      });
    } else {
      this.querySelector('.result').innerHTML = '';
    }
  }
}

customElements.define('reverse-widget', ReverseWidget);

export default ReverseWidget;
