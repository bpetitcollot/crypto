import SplitLettersWidget from './splitletters-widget.js';
import SplitWordsWidget from './splitwords-widget.js';
import ReverseWidget from './reverse-widget.js';
import CountLettersWidget from './countletters-widget.js';
import CountWordssWidget from './countwords-widget.js';

export default {
  datasets: [
    'example',
    'chouette'
  ],
  decrypt: {
    'splitletters-widget': "Lignes à nombre de caractères fixe",
    'splitwords-widget': "Lignes à nombre de mots fixe",
    'reverse-widget': "Comparer à l'endroit / à l'envers",
    'countletters-widget': "Compter les lettres",
    'countwords-widget': "Compter les mots"
  }
};
